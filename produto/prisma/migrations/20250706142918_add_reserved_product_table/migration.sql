-- CreateTable
CREATE TABLE `reserved_product` (
    `id` VARCHAR(191) NOT NULL,
    `products_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `price_total` DECIMAL(19, 4) NOT NULL,
    `status` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
