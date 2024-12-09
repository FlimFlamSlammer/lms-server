/*
  Warnings:

  - You are about to drop the column `bachelorsDegree` on the `Teacher` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Teacher` DROP COLUMN `bachelorsDegree`,
    ADD COLUMN `bachelorDegree` VARCHAR(191) NULL;
