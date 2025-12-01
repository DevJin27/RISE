/*
  Warnings:

  - You are about to drop the `LeetCodeSubmission` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."LeetCodeSubmission" DROP CONSTRAINT "LeetCodeSubmission_leetCodeUserId_fkey";

-- DropTable
DROP TABLE "public"."LeetCodeSubmission";
