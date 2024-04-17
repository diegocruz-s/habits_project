-- DropForeignKey
ALTER TABLE `habit` DROP FOREIGN KEY `Habit_userId_fkey`;

-- DropForeignKey
ALTER TABLE `weekday` DROP FOREIGN KEY `WeekDay_habitId_fkey`;

-- AddForeignKey
ALTER TABLE `Habit` ADD CONSTRAINT `Habit_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WeekDay` ADD CONSTRAINT `WeekDay_habitId_fkey` FOREIGN KEY (`habitId`) REFERENCES `Habit`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
