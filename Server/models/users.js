const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  is_deleted: { type: Boolean, default: false },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
