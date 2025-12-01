import prisma from "../db/prisma.js";
import { createInitialSync } from "../clients/leetcodeSync.service.js";

export const initialSync = async (req, res) => {
  const { username } = req.params;
  const userId = req.user.id;

  const exists = await prisma.leetCodeUser.findUnique({ where: { username } });
  if (exists) {
    return res.status(409).json({
      success: false,
      error: "This LeetCode profile is already linked",
    });
  }

  const lc = req.leetcodeClient;

  const [profile, skills, calendar, recent] = await Promise.all([
    lc.getUserProfile(username),
    lc.getUserSkillStats(username),
    lc.getUserCalendar(username),
    lc.getRecentPublicSubmissions(username, 50),
  ]);

  if (!profile) {
    return res.status(404).json({
      success: false,
      error: "LeetCode user not found",
    });
  }

  const lcUser = await createInitialSync({
    profile,
    skills,
    calendar,
    recent,
    username,
    userId,
  });

  res.json({
    success: true,
    message: "Initial sync complete",
    data: lcUser,
  });
};