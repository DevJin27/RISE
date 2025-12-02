import prisma from "../db/prisma.js";
import { LeetCodeClient } from "../clients/leetcodeClient.js";

export async function getLeetCodeDashboard(req, res) {
  try {
    const userId = req.user.id;

    // ---- FETCH DB PROFILE + CALENDAR + SKILLS ---- //
    const lc = await prisma.leetCodeUser.findUnique({
      where: { userId },
      include: {
        skillStats: true,
        calendar: true,
      },
    });

    if (!lc) {
      return res.status(404).json({
        success: false,
        message: "LeetCode profile not synced yet.",
      });
    }

    // ---- USER BASIC INFO ---- //
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    // ---- LIVE RECENT SUBMISSIONS FROM LEETCODE ---- //
    const lcClient = new LeetCodeClient({});
    const recent = await lcClient.getRecentPublicSubmissions(lc.username, 20);

    // Format recent submissions to match your frontend
    const mappedRecent = (recent || []).map((s, i) => ({
      id: i,
      title: s.title,
      createdAt: Number(s.timestamp) * 1000,
      status: s.statusDisplay,
      lang: s.lang,
      difficulty: s.difficulty || "Unknown",
    }));

    // ---- RESPONSE SHAPE MATCHING YOUR FRONTEND ---- //
    const response = {
      user: {
        username: lc.username,
        realName: lc.realName || user.name,
        avatarUrl: lc.avatarUrl,
        reputation: lc.reputation ?? 0,
      },

      leetCodeUser: {
        totalSolved: lc.totalSolved ?? 0,
        easySolved: lc.easySolved ?? 0,
        mediumSolved: lc.mediumSolved ?? 0,
        hardSolved: lc.hardSolved ?? 0,
      },

      skillStats: lc.skillStats.map((s) => ({
        id: s.id,
        tagName: s.tagName,
        solved: s.solved,
      })),

      recentSubmissions: mappedRecent,

      calendar: lc.calendar || {
        submissionsMap: {},
        streak: 0,
      },
    };

    return res.json({ success: true, data: response });
  } catch (err) {
    console.error("❌ Dashboard Load Error:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong loading dashboard data.",
    });
  }
}

