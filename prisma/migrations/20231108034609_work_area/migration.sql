/*
  Warnings:

  - Added the required column `latitude` to the `work_area` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `work_area` table without a default value. This is not possible if the table is not empty.
  - Added the required column `radius` to the `work_area` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `work_area` ADD COLUMN `latitude` DECIMAL(65, 30) NOT NULL,
    ADD COLUMN `longitude` DECIMAL(65, 30) NOT NULL,
    ADD COLUMN `radius` DECIMAL(65, 30) NOT NULL;
