DROP TABLE IF EXISTS images;

CREATE TABLE images (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `credential_login` VARCHAR(255) NOT NULL,
  `credential_password` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB;
