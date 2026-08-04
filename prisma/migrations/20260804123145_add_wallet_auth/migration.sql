/*
  Warnings:

  - A unique constraint covering the columns `[wallet_address]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `nonce` VARCHAR(191) NULL,
    ADD COLUMN `wallet_address` VARCHAR(191) NULL,
    MODIFY `email` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `users_wallet_address_key` ON `users`(`wallet_address`);
