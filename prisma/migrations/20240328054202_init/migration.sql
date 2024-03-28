/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "User_email_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "User";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TodaysReminders" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "time" DATETIME NOT NULL,
    "complete" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_TodaysReminders" ("body", "complete", "createdAt", "id", "time", "title", "userId") SELECT "body", "complete", "createdAt", "id", "time", "title", "userId" FROM "TodaysReminders";
DROP TABLE "TodaysReminders";
ALTER TABLE "new_TodaysReminders" RENAME TO "TodaysReminders";
CREATE TABLE "new_Reminder" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "time" DATETIME NOT NULL,
    "complete" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Reminder" ("body", "complete", "createdAt", "id", "time", "title", "userId") SELECT "body", "complete", "createdAt", "id", "time", "title", "userId" FROM "Reminder";
DROP TABLE "Reminder";
ALTER TABLE "new_Reminder" RENAME TO "Reminder";
CREATE TABLE "new_expiredReminders" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "time" DATETIME NOT NULL,
    "complete" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_expiredReminders" ("body", "complete", "createdAt", "id", "time", "title", "userId") SELECT "body", "complete", "createdAt", "id", "time", "title", "userId" FROM "expiredReminders";
DROP TABLE "expiredReminders";
ALTER TABLE "new_expiredReminders" RENAME TO "expiredReminders";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
