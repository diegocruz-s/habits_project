/*
  Warnings:

  - Added the required column `isActive` to the `Habit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `habit` ADD COLUMN `isActive` BOOLEAN NOT NULL;
