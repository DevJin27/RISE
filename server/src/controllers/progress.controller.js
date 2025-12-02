import prisma from "../db/prisma.js";

export const markSolved = async (req, res) => {
  const { problemId } = req.params;
  const userId = req.user.id;

  try {
    const progress = await prisma.userProblemProgress.upsert({
      where: {
        userId_problemId: { userId, problemId }
      },
      create: { userId, problemId },
      update: {} // nothing to update because solvedAt never changes
    });

    res.json({ success: true, data: progress });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
export const unmarkSolved = async (req, res) => {
  const { problemId } = req.params;
  const userId = req.user.id;

  try {
    await prisma.userProblemProgress.delete({
      where: {
        userId_problemId: { userId, problemId }
      }
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
export const getProgress = async (req, res) => {
  try {
    const userId = req.user.id;

    const data = await prisma.userProblemProgress.findMany({
      where: { userId }
    });

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};