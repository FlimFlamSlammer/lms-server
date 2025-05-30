/*
  Warnings:

  - You are about to drop the column `attachmentPath` on the `Assignment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Assignment` DROP COLUMN `attachmentPath`,
    ADD COLUMN `description` VARCHAR(191) NULL;
