-- AlterTable
ALTER TABLE `Teacher` ADD COLUMN `subjectId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Teacher` ADD CONSTRAINT `Teacher_subjectId_fkey` FOREIGN KEY (`subjectId`) REFERENCES `Subject`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
