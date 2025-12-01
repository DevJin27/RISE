import fs from "fs";
import newData from "./newData.js";

async function annotateDifficulty() {
  const res = await fetch("https://leetcode.com/api/problems/all/");
  const leetcodeData = await res.json();

  const levels = ["easy", "medium", "hard"];
  const slugToDifficulty = {};

  for (const entry of leetcodeData.stat_status_pairs) {
    const slug = entry.stat.question__title_slug;
    const level = entry.difficulty.level;
    slugToDifficulty[slug] = levels[level - 1];
  }

  const updated = {};

  for (const topic in newData) {
    updated[topic] = newData[topic].map(problem => ({
      ...problem,
      difficulty: slugToDifficulty[problem.id] || "unknown"
    }));
  }

  // Save output as a clean JS module
  const output = "const newData = " + JSON.stringify(updated, null, 2) + "\n\nexport default newData;";
  await fs.promises.writeFile("./newData_with_difficulty.js", output);

  console.log("✅ Done: newData_with_difficulty.js created.");
}

annotateDifficulty();