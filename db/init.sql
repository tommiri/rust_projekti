CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(36) NOT NULL,
  `email` VARCHAR(50) NOT NULL,
  `first_name` VARCHAR(50),
  `last_name` VARCHAR(50),
  `password` VARCHAR(60) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY(`id`)
) ENGINE = InnoDB DEFAULT CHARSET = latin1;

CREATE TABLE IF NOT EXISTS `emails` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user` VARCHAR(36) NOT NULL,
  `email` VARCHAR(50) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY(`id`),
  FOREIGN KEY(`user`) REFERENCES `users`(`id`)
  ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = latin1;

INSERT INTO `users` (`id`, `email`, `password`)
VALUES (
  '1',
  'db@user.com',
  'test'
);

INSERT INTO `emails` (`user`, `email`)
VALUES (
  (SELECT `id` FROM `users` WHERE `email` = 'db@user.com'),
  'db@test.com'
);