-- CreateEnum
CREATE TYPE "SkillCategory" AS ENUM ('FUNDAMENTAL', 'INTERMEDIATE', 'ADVANCED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeetCodeUser" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "realName" TEXT,
    "country" TEXT,
    "school" TEXT,
    "avatarUrl" TEXT,
    "ranking" INTEGER,
    "reputation" INTEGER,
    "totalSolved" INTEGER,
    "totalSubmissions" INTEGER,
    "easySolved" INTEGER,
    "mediumSolved" INTEGER,
    "hardSolved" INTEGER,
    "lastSyncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "LeetCodeUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeetCodeSkillStat" (
    "id" TEXT NOT NULL,
    "category" "SkillCategory" NOT NULL,
    "tagName" TEXT NOT NULL,
    "tagSlug" TEXT NOT NULL,
    "solved" INTEGER NOT NULL,
    "leetCodeUserId" TEXT NOT NULL,

    CONSTRAINT "LeetCodeSkillStat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeetCodeSubmission" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "lang" TEXT NOT NULL,
    "timestamp" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "likes" INTEGER,
    "dislikes" INTEGER,
    "isPaidOnly" BOOLEAN,
    "leetCodeUserId" TEXT NOT NULL,

    CONSTRAINT "LeetCodeSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeetCodeCalendar" (
    "id" TEXT NOT NULL,
    "streak" INTEGER,
    "totalActiveDays" INTEGER,
    "activeYears" JSONB,
    "submissionsMap" JSONB,
    "leetCodeUserId" TEXT NOT NULL,

    CONSTRAINT "LeetCodeCalendar_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "LeetCodeUser_username_key" ON "LeetCodeUser"("username");

-- CreateIndex
CREATE UNIQUE INDEX "LeetCodeUser_userId_key" ON "LeetCodeUser"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "LeetCodeCalendar_leetCodeUserId_key" ON "LeetCodeCalendar"("leetCodeUserId");

-- AddForeignKey
ALTER TABLE "LeetCodeUser" ADD CONSTRAINT "LeetCodeUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeetCodeSkillStat" ADD CONSTRAINT "LeetCodeSkillStat_leetCodeUserId_fkey" FOREIGN KEY ("leetCodeUserId") REFERENCES "LeetCodeUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeetCodeSubmission" ADD CONSTRAINT "LeetCodeSubmission_leetCodeUserId_fkey" FOREIGN KEY ("leetCodeUserId") REFERENCES "LeetCodeUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeetCodeCalendar" ADD CONSTRAINT "LeetCodeCalendar_leetCodeUserId_fkey" FOREIGN KEY ("leetCodeUserId") REFERENCES "LeetCodeUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
