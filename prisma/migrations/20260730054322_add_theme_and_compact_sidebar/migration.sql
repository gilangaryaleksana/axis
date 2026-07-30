-- AlterTable
ALTER TABLE `users` ADD COLUMN `compact_sidebar` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `theme` VARCHAR(191) NOT NULL DEFAULT 'dark';
