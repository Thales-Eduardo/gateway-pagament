/*
  Warnings:

  - Added the required column `user_id` to the `register_payment_request` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `register_payment_request` ADD COLUMN `user_id` VARCHAR(255) NOT NULL;
