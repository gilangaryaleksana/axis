-- AlterTable
ALTER TABLE `messages` ADD COLUMN `type` ENUM('text', 'wallet_balance', 'wallet_tx') NOT NULL DEFAULT 'text';
