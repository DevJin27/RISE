import prisma from "../src/db/prisma.js";
import newData from "../../client/src/app/(main)/problemset/newData_with_difficulty.js";

async function main() {
  console.log("🌱 Seeding NeetCode Problems...");

  const allProblems = [];

  // Flatten categories → problems[]
  for (const [topic, problems] of Object.entries(newData)) {
    for (const p of problems) {
      allProblems.push({
        id: p.id,                // slug
        name: p.name,            // problem name
        difficulty: p.difficulty,
        idx: p.idx,              // numeric index
        topic,                   // category ("Arrays & Hashing")
      });
    }
  }

  console.log(`Found ${allProblems.length} problems to seed.`);

  for (const p of allProblems) {
    await prisma.problem.upsert({
      where: { id: p.id },
      create: p,
      update: {} // no updates needed
    });
  }

  console.log("✅ Done. Problems seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });