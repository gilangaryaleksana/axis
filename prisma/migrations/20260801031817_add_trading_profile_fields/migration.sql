-- AlterTable
ALTER TABLE `users` ADD COLUMN `communication_style` VARCHAR(191) NULL,
    ADD COLUMN `trading_background` VARCHAR(191) NULL,
    ADD COLUMN `trading_goal` VARCHAR(191) NULL,
    ADD COLUMN `trading_instrument` VARCHAR(191) NULL,
    ADD COLUMN `trading_struggle` VARCHAR(191) NULL;
