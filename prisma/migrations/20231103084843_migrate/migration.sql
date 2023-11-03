/*
  Warnings:

  - A unique constraint covering the columns `[id_card]` on the table `empolyee_information` will be added. If there are existing duplicate values, this will fail.
  - Made the column `method` on table `transaction_in` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `empolyee_information` ADD COLUMN `status` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `transaction_in` MODIFY `method` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `empolyee_information_id_card_key` ON `empolyee_information`(`id_card`);
