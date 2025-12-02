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


export const updateSync = async (req, res) => {
  try {
    const userId = req.user.id;
    const lcUser = await prisma.leetCodeUser.findUnique({
      where: { userId },
    });

    if (!lcUser) {
      return res.status(404).json({
        success: false,
        message: "You must complete initial sync before updating.",
      });
    }

    const username = lcUser.username;
    const lc = req.leetcodeClient;

    // 🔥 Fetch new data
    const [profile, skills, calendar, recent] = await Promise.all([
      lc.getUserProfile(username),
      lc.getUserSkillStats(username),
      lc.getUserCalendar(username),
      lc.getRecentPublicSubmissions(username, 50),
    ]);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "LeetCode user not found",
      });
    }

    // -------------------------
    // 🔥 Process Stats
    // -------------------------
    const stats = profile.submitStats.acSubmissionNum.reduce((acc, row) => {
      acc[row.difficulty.toLowerCase()] = row.count;
      return acc;
    }, {});

    const totalSolved =
      (stats.easy ?? 0) + (stats.medium ?? 0) + (stats.hard ?? 0);

    // -------------------------
    // 🔥 Update LeetCodeUser Row
    // -------------------------
    const updatedUser = await prisma.leetCodeUser.update({
      where: { id: lcUser.id },
      data: {
        realName: profile.profile.realName,
        country: profile.profile.countryName,
        school: profile.profile.school,
        avatarUrl: profile.profile.userAvatar,
        ranking: profile.profile.ranking,
        reputation: profile.profile.reputation,

        totalSolved,
        easySolved: stats.easy,
        mediumSolved: stats.medium,
        hardSolved: stats.hard,

        lastSyncedAt: new Date(),

        // Remove old skillStats + recreate
        skillStats: {
          deleteMany: {},
          create: [
            ...skills.fundamental.map(t => ({
              category: "FUNDAMENTAL",
              tagName: t.tagName,
              tagSlug: t.tagSlug,
              solved: t.problemsSolved,
            })),
            ...skills.intermediate.map(t => ({
              category: "INTERMEDIATE",
              tagName: t.tagName,
              tagSlug: t.tagSlug,
              solved: t.problemsSolved,
            })),
            ...skills.advanced.map(t => ({
              category: "ADVANCED",
              tagName: t.tagName,
              tagSlug: t.tagSlug,
              solved: t.problemsSolved,
            })),
          ],
        },

        // Calendar update
        calendar: {
          update: {
            streak: calendar.streak,
            totalActiveDays: calendar.totalActiveDays,
            activeYears: calendar.activeYears,
            submissionsMap: calendar.submissionCalendar,
          },
        },
      },
    });

    return res.json({
      success: true,
      message: "Sync updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    console.error("Update sync error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to update sync",
      error: err.message,
    });
  }
};
