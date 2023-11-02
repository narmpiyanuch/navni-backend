-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NULL,
    `password` VARCHAR(191) NULL,
    `googleId` VARCHAR(191) NULL,
    `role` ENUM('USER', 'DRIVER', 'ADMIN') NOT NULL DEFAULT 'USER',

    UNIQUE INDEX `user_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `member_infomation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(10) NULL,
    `stipeId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wallet` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `memberInfomationId` INTEGER NOT NULL,
    `amount` DECIMAL(20, 2) NOT NULL DEFAULT 0.00,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transaction_in` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `walletId` INTEGER NOT NULL,
    `price` DECIMAL(20, 2) NOT NULL,
    `method` ENUM('QRCODE', 'CREDIT_CARD') NULL,
    `transactionId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transaction_out` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `price` DECIMAL(20, 2) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `walletId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EmployeeInfomation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `idCard` VARCHAR(13) NOT NULL,
    `phoneNumber` VARCHAR(10) NOT NULL,
    `gender` ENUM('MALE', 'FEMALE', 'OTHER') NOT NULL,
    `image` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Carinfomation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `employeeInfomationId` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 6,
    `plateNumber` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WorkArea` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `areaName` VARCHAR(191) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SubAreaStation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `stationName` VARCHAR(191) NOT NULL,
    `latitude` DECIMAL(65, 30) NOT NULL,
    `longitude` DECIMAL(65, 30) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `workAreaId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Booking` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `memberInfomationId` INTEGER NOT NULL,
    `carinfomationId` INTEGER NOT NULL,
    `subAreaStationId` INTEGER NOT NULL,
    `passenger` INTEGER NOT NULL,
    `price` DECIMAL(65, 30) NOT NULL,
    `status` ENUM('WAITING', 'COMING', 'PICKED', 'DONE', 'CANCEL') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `member_infomation` ADD CONSTRAINT `member_infomation_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wallet` ADD CONSTRAINT `wallet_memberInfomationId_fkey` FOREIGN KEY (`memberInfomationId`) REFERENCES `member_infomation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaction_in` ADD CONSTRAINT `transaction_in_walletId_fkey` FOREIGN KEY (`walletId`) REFERENCES `wallet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaction_out` ADD CONSTRAINT `transaction_out_walletId_fkey` FOREIGN KEY (`walletId`) REFERENCES `wallet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmployeeInfomation` ADD CONSTRAINT `EmployeeInfomation_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Carinfomation` ADD CONSTRAINT `Carinfomation_employeeInfomationId_fkey` FOREIGN KEY (`employeeInfomationId`) REFERENCES `EmployeeInfomation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubAreaStation` ADD CONSTRAINT `SubAreaStation_workAreaId_fkey` FOREIGN KEY (`workAreaId`) REFERENCES `WorkArea`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_memberInfomationId_fkey` FOREIGN KEY (`memberInfomationId`) REFERENCES `member_infomation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_carinfomationId_fkey` FOREIGN KEY (`carinfomationId`) REFERENCES `Carinfomation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_subAreaStationId_fkey` FOREIGN KEY (`subAreaStationId`) REFERENCES `SubAreaStation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
