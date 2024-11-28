CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(255) NOT NULL UNIQUE,
  -- UUID
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `first_name` VARCHAR(255),
  `last_name` VARCHAR(255),
  `password_hash` VARCHAR(255) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY(`id`)
) ENGINE = InnoDB DEFAULT CHARSET = latin1;

CREATE TABLE IF NOT EXISTS `emails` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY(`id`),
  FOREIGN KEY(`user`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = latin1;

INSERT INTO
  `users` (`id`, `email`, `password`)
VALUES
  (1, 'db@user.com', 'test');

INSERT INTO
  `emails` (`user`, `email`)
VALUES
  (
    (
      SELECT
        `id`
      FROM
        `users`
      WHERE
        `email` = 'db@user.com'
    ),
    'db@test.com'
  );