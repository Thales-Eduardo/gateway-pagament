-- AlterTable
ALTER TABLE `register_payment_request` ADD COLUMN `retry_count` INTEGER NULL DEFAULT 0;
