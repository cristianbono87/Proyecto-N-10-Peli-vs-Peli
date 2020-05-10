USE competencias;

CREATE TABLE `competicion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `competencias`.`competicion` (`id`, `nombre`)
VALUES
    ('1', 'pelicula mas larga'),
    ('2', 'peor actor principal'),
    ('3', 'peor final'),
    ('4', 'mejores efectos especiales');
