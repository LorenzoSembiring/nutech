CREATE TABLE `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `email` VARCHAR(255) NOT NULL,
    `first_name` VARCHAR(255) NOT NULL,
    `last_name` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `profile_image` VARCHAR(255),
    `balance` INT
);

CREATE TABLE `banners` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `banner_name` VARCHAR(255) NOT NULL,
    `banner_image` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL
);

CREATE TABLE `services` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `service_code` VARCHAR(255) NOT NULL,
    `service_name` VARCHAR(255) NOT NULL,
    `service_icon` VARCHAR(255) NOT NULL,
    `service_tariff` INT NOT NULL
);

CREATE TABLE `transactions` (
    `id` VARCHAR(20) PRIMARY KEY,
    `service_id` INT NOT NULL,
    `user_id` INT NOT NULL,
    `transaction_type` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `total_amount` INT NOT NULL,
    `created_on` DATETIME,
    FOREIGN KEY (`service_id`) REFERENCES `services` (`id`),
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
    INDEX (`service_id`),
    INDEX (`user_id`)
);
