/*
  Warnings:

  - You are about to drop the `AssignmentToStudent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `AssignmentToStudent` DROP FOREIGN KEY `AssignmentToStudent_assignmentId_fkey`;

-- DropForeignKey
ALTER TABLE `AssignmentToStudent` DROP FOREIGN KEY `AssignmentToStudent_studentId_fkey`;

-- DropTable
DROP TABLE `AssignmentToStudent`;

-- CreateTable
CREATE TABLE `Submission` (
    `studentId` VARCHAR(191) NOT NULL,
    `assignmentId` VARCHAR(191) NOT NULL,
    `grade` INTEGER NULL,
    `attachmentPath` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`studentId`, `assignmentId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Submission` ADD CONSTRAINT `Submission_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Submission` ADD CONSTRAINT `Submission_assignmentId_fkey` FOREIGN KEY (`assignmentId`) REFERENCES `Assignment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
