-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_expiredReminders" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "time" DATETIME NOT NULL,
    "complete" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "expiredReminders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_expiredReminders" ("body", "complete", "createdAt", "id", "time", "title", "userId") SELECT "body", "complete", "createdAt", "id", "time", "title", "userId" FROM "expiredReminders";
DROP TABLE "expiredReminders";
ALTER TABLE "new_expiredReminders" RENAME TO "expiredReminders";
CREATE TABLE "new_Reminder" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "time" DATETIME NOT NULL,
    "complete" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Reminder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Reminder" ("body", "complete", "createdAt", "id", "time", "title", "userId") SELECT "body", "complete", "createdAt", "id", "time", "title", "userId" FROM "Reminder";
DROP TABLE "Reminder";
ALTER TABLE "new_Reminder" RENAME TO "Reminder";
CREATE TABLE "new_TodaysReminders" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "time" DATETIME NOT NULL,
    "complete" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "TodaysReminders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TodaysReminders" ("body", "complete", "createdAt", "id", "time", "title", "userId") SELECT "body", "complete", "createdAt", "id", "time", "title", "userId" FROM "TodaysReminders";
DROP TABLE "TodaysReminders";
ALTER TABLE "new_TodaysReminders" RENAME TO "TodaysReminders";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
