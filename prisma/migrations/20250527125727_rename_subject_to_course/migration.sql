/*
  Warnings:

  - You are about to drop the column `subjectId` on the `Assignment` table. All the data in the column will be lost.
  - You are about to drop the `_ClassToSubject` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_SubjectToTeacher` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `courseId` to the `Assignment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Assignment` DROP FOREIGN KEY `Assignment_subjectId_fkey`;

-- DropForeignKey
ALTER TABLE `_ClassToSubject` DROP FOREIGN KEY `_ClassToSubject_A_fkey`;

-- DropForeignKey
ALTER TABLE `_ClassToSubject` DROP FOREIGN KEY `_ClassToSubject_B_fkey`;

-- DropForeignKey
ALTER TABLE `_SubjectToTeacher` DROP FOREIGN KEY `_SubjectToTeacher_A_fkey`;

-- DropForeignKey
ALTER TABLE `_SubjectToTeacher` DROP FOREIGN KEY `_SubjectToTeacher_B_fkey`;

-- AlterTable
ALTER TABLE `Assignment` DROP COLUMN `subjectId`,
    ADD COLUMN `courseId` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `_ClassToSubject`;

-- DropTable
DROP TABLE `_SubjectToTeacher`;

-- CreateTable
CREATE TABLE `_CourseToTeacher` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_CourseToTeacher_AB_unique`(`A`, `B`),
    INDEX `_CourseToTeacher_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ClassToCourse` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_ClassToCourse_AB_unique`(`A`, `B`),
    INDEX `_ClassToCourse_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Assignment` ADD CONSTRAINT `Assignment_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Subject`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CourseToTeacher` ADD CONSTRAINT `_CourseToTeacher_A_fkey` FOREIGN KEY (`A`) REFERENCES `Subject`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CourseToTeacher` ADD CONSTRAINT `_CourseToTeacher_B_fkey` FOREIGN KEY (`B`) REFERENCES `Teacher`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ClassToCourse` ADD CONSTRAINT `_ClassToCourse_A_fkey` FOREIGN KEY (`A`) REFERENCES `Class`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ClassToCourse` ADD CONSTRAINT `_ClassToCourse_B_fkey` FOREIGN KEY (`B`) REFERENCES `Subject`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
