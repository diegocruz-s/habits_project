/*
  Warnings:

  - A unique constraint covering the columns `[dayId,habitId]` on the table `DayHabitComplete` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `DayHabitComplete_dayId_habitId_key` ON `DayHabitComplete`(`dayId`, `habitId`);
