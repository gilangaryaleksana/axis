-- AlterTable
ALTER TABLE `users` ADD COLUMN `email_notifications` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `in_app_sound` BOOLEAN NOT NULL DEFAULT false;
