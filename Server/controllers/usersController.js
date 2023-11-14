const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const joi = require("joi");
const User = require("../models/users");

async function userSignup(req, res) {
  const { firstname, lastname, email, password } = req.body;

  try {
    const schema = joi.object({
      firstname: joi.string().alphanum().min(3).max(20).required(),
      lastname: joi.string().min(3).max(20).required(),
      email: joi
        .string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .required(),
      password: joi
        .string()
        .pattern(
          new RegExp(
            "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&!])[A-Za-z\\d@#$%^&!]{6,30}$"
          )
        )
        .required(),
    });

    const { error } = schema.validate({ firstname, lastname, email, password });

    if (error) {
      return res.status(400).json({ error: error.details });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if the user already exists
    const existingUser = await User.findOne({ email, is_deleted: false });

    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    // Create a new user
    const newUser = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      message: "User added successfully",
      user_id: newUser._id,
    });
  } catch (error) {
    console.error("Failed to register:", error);
    res.status(500).json({ error: "Failed to register" });
  }
}

async function userLogin(req, res) {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email, is_deleted: false });

    if (user) {
      // Compare passwords
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        // Generate and return the JWT token
        const token = jwt.sign(
          {
            user_id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
          },
          process.env.SECRET_KEY,
          { expiresIn: "1h" }
        );
        res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });
        res.json({
          message: "Login successful",
          user: {
            user_id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
          },
          token,
        });
      } else {
        res.status(401).json({ error: "Invalid email or password" });
      }
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Login failed:", error);
    res.status(500).json({ error: "Login failed" });
  }
}

async function updateUser(req, res) {
  const user_id = req.params.id;
  const { firstname, lastname, email, password } = req.body;

  try {
    const schema = joi.object({
      firstname: joi.string().required(),
      lastname: joi.string().required(),
      email: joi.string().email().required(),
      password: joi.string().required(),
    });

    const { error } = schema.validate({ firstname, lastname, email, password });

    if (error) {
      return res.status(400).json({ error: error.details });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = await User.findByIdAndUpdate(
      user_id,
      {
        firstname,
        lastname,
        email,
        password: hashedPassword,
      },
      { new: true }
    );

    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Update user failed" });
  }
}

async function deleteUser(req, res) {
  const user_id = req.params.id;

  try {
    const deletedUser = await User.findByIdAndUpdate(
      user_id,
      { is_deleted: true },
      { new: true }
    );

    if (deletedUser) {
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ error: "User not found or already been deleted" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Delete user failed" });
  }
}

module.exports = {
  userSignup,
  userLogin,
  updateUser,
  deleteUser,
};
