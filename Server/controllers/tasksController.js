const Task = require("../models/tasks");

// Create a task for the authenticated user
async function createTask(req, res) {
  const { title, description, dueDate, status, priority } = req.body;

  // The user _id is available from the decoded JWT token
  const user_id = req.user.user_id;

  try {
    const newTask = new Task({
      title,
      description,
      dueDate,
      status,
      priority,
      user: user_id, // Assign the user ID from the JWT token to the task
    });

    await newTask.save();

    res.status(201).json({
      message: "Task added successfully",
      task_id: newTask._id,
    });
  } catch (error) {
    console.error("Failed to add task:", error);
    res.status(500).json({ error: "Failed to add task" });
  }
}

// Get all tasks for the authenticated user
async function getAllTasks(req, res) {
  // The user _id is available from the decoded JWT token
  const user_id = req.user.user_id;

  try {
    const tasks = await Task.find({ user: user_id, is_deleted: false });

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Failed to get tasks:", error);
    res.status(500).json({ error: "Failed to get tasks" });
  }
}

// Get a specific task by ID
async function getTaskById(req, res) {
  const { id } = req.params; // Extract task ID from URL parameters

  try {
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error("Failed to get task by ID:", error);
    res.status(500).json({ error: "Failed to get task by ID" });
  }
}

// Update a specific task by ID
async function updateTask(req, res) {
  const { id } = req.params; // Extract task ID from URL parameters
  const { title, description, dueDate, status, priority } = req.body;

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      {
        title,
        description,
        dueDate,
        status,
        priority,
      },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Failed to update task:", error);
    res.status(500).json({ error: "Failed to update task" });
  }
}

// Delete a specific task by ID
async function deleteTask(req, res) {
  const { id } = req.params; // Extract task ID from URL parameters

  try {
    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Failed to delete task:", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
}

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
