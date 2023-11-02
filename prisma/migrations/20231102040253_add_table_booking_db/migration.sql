/*
  Warnings:

  - You are about to drop the column `sub_area_station_id` on the `booking` table. All the data in the column will be lost.
  - Added the required column `drop_down_station_id` to the `booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `picked_up_station_id` to the `booking` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `booking` DROP FOREIGN KEY `booking_car_information_id_fkey`;

-- DropForeignKey
ALTER TABLE `booking` DROP FOREIGN KEY `booking_sub_area_station_id_fkey`;

-- AlterTable
ALTER TABLE `booking` DROP COLUMN `sub_area_station_id`,
    ADD COLUMN `drop_down_station_id` INTEGER NOT NULL,
    ADD COLUMN `picked_up_station_id` INTEGER NOT NULL,
    MODIFY `car_information_id` INTEGER NULL,
    MODIFY `status` ENUM('WAITING', 'COMING', 'PICKED', 'DONE', 'CANCEL') NOT NULL DEFAULT 'WAITING';

-- AddForeignKey
ALTER TABLE `booking` ADD CONSTRAINT `booking_car_information_id_fkey` FOREIGN KEY (`car_information_id`) REFERENCES `car_information`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `booking` ADD CONSTRAINT `booking_picked_up_station_id_fkey` FOREIGN KEY (`picked_up_station_id`) REFERENCES `sub_area_station`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `booking` ADD CONSTRAINT `booking_drop_down_station_id_fkey` FOREIGN KEY (`drop_down_station_id`) REFERENCES `sub_area_station`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
