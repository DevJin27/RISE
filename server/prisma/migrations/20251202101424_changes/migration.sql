/*
  Warnings:

  - You are about to drop the column `solvedAt` on the `UserProblemProgress` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserProblemProgress" DROP COLUMN "solvedAt",
ADD COLUMN     "solved" BOOLEAN NOT NULL DEFAULT true;
