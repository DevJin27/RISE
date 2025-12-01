"use server"
export async function GET() {
  const MOCK = {
    user: {
      id: "user_123",
      username: "dev",
      realName: "Dev",
      country: "IN",
      avatarUrl: "",
      ranking: 18432,
      reputation: 1340,
    },
    leetCodeUser: {
      totalSolved: 1580,
      totalSubmissions: 2400,
      easySolved: 820,
      mediumSolved: 600,
      hardSolved: 160,
    },
    calendar: {
      streak: 15,
      totalActiveDays: 420,
      // submissionsMap: { '2025-11-01': 1, '2025-11-02': 2, ... }
      submissionsMap: generateLastNDaysMap(180)
    },
    skillStats: [
      { id: "s1", category: "FUNDAMENTAL", tagName: "Arrays", tagSlug: "arrays", solved: 220 },
      { id: "s2", category: "FUNDAMENTAL", tagName: "Strings", tagSlug: "strings", solved: 190 },
      { id: "s3", category: "INTERMEDIATE", tagName: "Dynamic Programming", tagSlug: "dp", solved: 150 },
      { id: "s4", category: "INTERMEDIATE", tagName: "Graphs", tagSlug: "graphs", solved: 90 },
      { id: "s5", category: "ADVANCED", tagName: "Segment Trees", tagSlug: "segtree", solved: 30 }
    ],
    recentSubmissions: [
      { id: "r1", title: "Unique Paths", status: "Accepted", difficulty: "Medium", lang: "JS", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
      { id: "r2", title: "Binary Tree Paths", status: "Wrong Answer", difficulty: "Medium", lang: "Python", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
      { id: "r3", title: "Two Sum", status: "Accepted", difficulty: "Easy", lang: "TS", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString() },
      { id: "r4", title: "LRU Cache", status: "Accepted", difficulty: "Hard", lang: "C++", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 80).toISOString() },
      { id: "r5", title: "Frog Jump", status: "Time Limit", difficulty: "Hard", lang: "JS", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString() }
    ]
  };

  return new Response(JSON.stringify(MOCK), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}

/** Helper: generate a submissionsMap for the last N days (randomized for the mock) */
function generateLastNDaysMap(n = 90) {
  const map = {};
  for (let i = 0; i < n; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10); // YYYY-MM-DD
    // random 0..3 submissions, bias to 0 and 1
    const chance = Math.random();
    const val = chance < 0.6 ? (Math.random() < 0.6 ? 0 : 1) : Math.floor(Math.random() * 3) + 1;
    if (val > 0) map[key] = val;
  }
  return map;
}