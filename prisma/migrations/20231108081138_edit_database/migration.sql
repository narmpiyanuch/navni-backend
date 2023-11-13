/*
  Warnings:

  - You are about to drop the column `userA_lastseen` on the `Chatroom` table. All the data in the column will be lost.
  - You are about to drop the column `userB_id` on the `Chatroom` table. All the data in the column will be lost.
  - You are about to drop the column `userB_lastseen` on the `Chatroom` table. All the data in the column will be lost.
  - You are about to drop the column `chatroomId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Message` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Chatroom` DROP FOREIGN KEY `Chatroom_userB_id_fkey`;

-- AlterTable
ALTER TABLE `Chatroom` DROP COLUMN `userA_lastseen`,
    DROP COLUMN `userB_id`,
    DROP COLUMN `userB_lastseen`;

-- AlterTable
ALTER TABLE `Message` DROP COLUMN `chatroomId`,
    DROP COLUMN `userId`;
