-- AlterTable
ALTER TABLE `conversations` ADD COLUMN `guest_id` VARCHAR(191) NULL,
    MODIFY `user_id` VARCHAR(191) NULL,
    MODIFY `title` VARCHAR(191) NOT NULL DEFAULT 'New Conversation';

-- CreateIndex
CREATE INDEX `conversations_guest_id_idx` ON `conversations`(`guest_id`);
