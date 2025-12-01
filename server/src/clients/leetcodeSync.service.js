import prisma from "../db/prisma.js";

export async function createInitialSync({ profile, skills, calendar, recent, username, userId }) {
  const stats = profile.submitStats.acSubmissionNum.reduce((acc, row) => {
    acc[row.difficulty.toLowerCase()] = row.count;
    return acc;
  }, {});

  const totalSolved = (stats.easy ?? 0) + (stats.medium ?? 0) + (stats.hard ?? 0);

  return await prisma.leetCodeUser.create({
    data: {
      username,
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
      userId,

      skillStats: {
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

      calendar: {
        create: {
          streak: calendar.streak,
          totalActiveDays: calendar.totalActiveDays,
          activeYears: calendar.activeYears,
          submissionsMap: calendar.submissionCalendar,
        },
      },
    },
  });
}