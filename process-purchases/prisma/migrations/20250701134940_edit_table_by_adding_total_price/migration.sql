/*
  Warnings:

  - Added the required column `total_price` to the `register_payment_request` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `register_payment_request` ADD COLUMN `total_price` DECIMAL(19, 4) NOT NULL;
