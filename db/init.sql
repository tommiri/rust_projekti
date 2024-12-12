CREATE TABLE IF NOT EXISTS `users` (
  `id` BINARY(16) NOT NULL DEFAULT (UUID_TO_BIN(UUID())),
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `first_name` VARCHAR(100),
  `last_name` VARCHAR(100),
  `password_hash` VARCHAR(255) NOT NULL,
  `email_verified` BOOLEAN NOT NULL DEFAULT FALSE,
  `verification_token` VARCHAR(255),
  `verification_expires` TIMESTAMP,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY(`id`),
  INDEX `email_idx` (`email`),
  INDEX `name_idx` (`last_name`, `first_name`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `emails` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user` BINARY(16) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY(`id`),
  FOREIGN KEY(`user`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Insert a test user
INSERT INTO `users`
  (
   `email`,
   `first_name`,
   `last_name`,
   `password_hash`,
   `email_verified`
  )
VALUES
  (
  'test@example.com',
  'Test',
  'User',
  '$argon2id$v=19$m=19456,t=2,p=1$Xafb2ty3hkee61MQJ8TY3g$e88StT3jn5DIlXMktzRuaIzZwSEhNhLB7Ou1GRzlaO8',
   TRUE);