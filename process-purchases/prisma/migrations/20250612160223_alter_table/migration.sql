/*
  Warnings:

  - The primary key for the `anti_duplication` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_transacao` on the `anti_duplication` table. All the data in the column will be lost.
  - Added the required column `id_transaction` to the `anti_duplication` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `anti_duplication` DROP PRIMARY KEY,
    DROP COLUMN `id_transacao`,
    ADD COLUMN `id_transaction` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id_transaction`);
