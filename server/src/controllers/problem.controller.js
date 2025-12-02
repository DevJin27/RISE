import prisma from "../db/prisma.js";
import { CATEGORY_ORDER } from "../utils/categoryOrder.js"; // put the list there

export const getAllProblems = async (req, res) => {
  try {
    // get all
    const problems = await prisma.problem.findMany();

    // sort by (1) category order, then (2) idx inside that category
    const sorted = problems.sort((a, b) => {
      const orderA = CATEGORY_ORDER.indexOf(a.topic);
      const orderB = CATEGORY_ORDER.indexOf(b.topic);

      // If categories differ → sort by category order
      if (orderA !== orderB) return orderA - orderB;

      // same category → sort by idx
      return a.idx - b.idx;
    });

    res.json({ success: true, data: sorted });
  } catch (err) {
    console.error("Error loading problems:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
