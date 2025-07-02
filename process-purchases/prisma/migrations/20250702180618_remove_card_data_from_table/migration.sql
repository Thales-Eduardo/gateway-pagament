/*
  Warnings:

  - You are about to drop the column `card_exp_month` on the `register_payment_request` table. All the data in the column will be lost.
  - You are about to drop the column `card_exp_year` on the `register_payment_request` table. All the data in the column will be lost.
  - You are about to drop the column `card_number` on the `register_payment_request` table. All the data in the column will be lost.
  - You are about to drop the column `card_security_code` on the `register_payment_request` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `register_payment_request` DROP COLUMN `card_exp_month`,
    DROP COLUMN `card_exp_year`,
    DROP COLUMN `card_number`,
    DROP COLUMN `card_security_code`;
