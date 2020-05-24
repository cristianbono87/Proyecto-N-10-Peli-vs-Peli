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

ALTER TABLE competicion ADD COLUMN genero_id INT(11) unsigned;
ALTER TABLE competicion ADD FOREIGN KEY (genero_id) REFERENCES genero (id);

ALTER TABLE competicion ADD COLUMN director_id INT(11) unsigned;
ALTER TABLE competicion ADD FOREIGN KEY (director_id) REFERENCES director (id);

ALTER TABLE competicion ADD COLUMN actor_id INT(11) unsigned;
ALTER TABLE competicion ADD FOREIGN KEY (actor_id) REFERENCES actor (id);


DROP TABLE IF EXISTS `voto`;

CREATE TABLE `voto` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `competencia_id` INT NOT NULL,
  `pelicula_id` INT(11) UNSIGNED NOT NULL, 
  PRIMARY KEY (id),
  FOREIGN KEY (competencia_id) REFERENCES competicion (id),
  FOREIGN KEY (pelicula_id) REFERENCES pelicula (id)
);

