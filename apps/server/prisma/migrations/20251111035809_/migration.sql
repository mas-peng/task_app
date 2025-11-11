/*
  Warnings:

  - You are about to drop the `TimeEntry` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Task" ADD COLUMN "endTime" DATETIME;
ALTER TABLE "Task" ADD COLUMN "startTime" DATETIME;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "TimeEntry";
PRAGMA foreign_keys=on;
