/*
  Warnings:

  - You are about to drop the column `solved` on the `UserProblemProgress` table. All the data in the column will be lost.
  - Made the column `solvedAt` on table `UserProblemProgress` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "UserProblemProgress" DROP COLUMN "solved",
ALTER COLUMN "solvedAt" SET NOT NULL,
ALTER COLUMN "solvedAt" SET DEFAULT CURRENT_TIMESTAMP;
