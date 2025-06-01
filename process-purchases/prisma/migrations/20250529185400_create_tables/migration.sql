-- CreateTable
CREATE TABLE `register_payment_request` (
    `id` VARCHAR(26) NOT NULL,
    `product_id` VARCHAR(255) NOT NULL,
    `price` FLOAT NOT NULL,
    `quantity` INTEGER NOT NULL,
    `card_number` VARCHAR(255) NOT NULL,
    `card_exp_month` VARCHAR(255) NOT NULL,
    `card_exp_year` VARCHAR(255) NOT NULL,
    `card_security_code` VARCHAR(255) NOT NULL,
    `status` INTEGER NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product` (
    `id` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `price` FLOAT NOT NULL,
    `quantity` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
