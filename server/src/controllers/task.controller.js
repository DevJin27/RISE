import prisma from "../db/prisma.js";

// READ — list tasks for the logged-in user
export const listTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, data: tasks });
  } catch (err) {
    console.error("List tasks error:", err);
    res.status(500).json({ success: false, message: "Failed to load tasks" });
  }
};

// CREATE
export const createTask = async (req, res) => {
  try {
    const task = await prisma.task.create({
      data: {
        title: req.body.title,
        userId: req.user.id,
      },
    });

    res.json({ success: true, data: task });
  } catch (err) {
    console.error("Create task error:", err);
    res.status(500).json({ success: false, message: "Failed to create task" });
  }
};

// UPDATE (mark as done)
export const updateTask = async (req, res) => {
  try {
    const updated = await prisma.task.update({
      where: { id: req.params.id },
      data: { isCompleted: true },
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error("Update task error:", err);
    res.status(500).json({ success: false, message: "Failed to update task" });
  }
};

// DELETE
export const deleteTask = async (req, res) => {
  try {
    await prisma.task.delete({
      where: { id: req.params.id },
    });

    res.json({ success: true, message: "Task deleted" });
  } catch (err) {
    console.error("Delete task error:", err);
    res.status(500).json({ success: false, message: "Failed to delete task" });
  }
};
