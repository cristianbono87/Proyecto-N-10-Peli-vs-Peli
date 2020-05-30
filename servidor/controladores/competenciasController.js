//!aqui creamos la referencia a la base de datos
const conexion = require('../conexion/conexion_db');

//!programacion de los pedidos a la base de datos

function todasLasCompetencias(req, res) {
console.log('todasLasCompetencias work');

  var sql = "select * from competicion";

  conexion.query(sql, function (err, results, fields) {
        if (err) {
            console.log("error" + err)
            return res.status(404).json('No hay competencias');
        };
        res.send(JSON.stringify(results));
    });
};

function listarDosPeliculas(req, res) {

    console.log('listarDosPeliculas work');

    var id = req.params.id;

    var sql = "SELECT * FROM competicion WHERE id = " + id;

    conexion.query(sql, function (err, competencia) {

        if (err) return res.status(404).send("Hubo un error en la consulta listarDosPeliculas");

        if (competencia.length === 0) {
            console.log("No se encontro ninguna competencia con ese id");
            return res.status(404).send("No se encontro ninguna competencia con ese id");
        }

        var sql = "SELECT DISTINCT pelicula.id, poster, titulo FROM pelicula " +
            "JOIN director_pelicula ON pelicula_id = pelicula.id " +
            "JOIN actor_pelicula ON actor_pelicula.pelicula_id = pelicula.id " +
        "WHERE true = true ";

        var genero_id = competencia[0].genero_id;
        var director_id = competencia[0].director_id;
        var actor_id = competencia[0].actor_id;

        var genero = genero_id ? " AND genero_id = " + genero_id : "";
        var director = director_id ? " AND director_id = " + director_id : "";
        var actor = actor_id ? " AND actor_id = " + actor_id : "";

        var orderBy = " ORDER BY RAND() LIMIT 2;";

        sql = sql + genero + director + actor + orderBy;

        conexion.query(sql, function (err, results, fields) {
            if (err) {
                console.log("error" + err)
                return res.status(404).send('No existen peliculas para esta competencia');
            };

                const result = {
                    'peliculas': results,
                    'competencia': competencia[0].nombre
                }
                res.send(JSON.stringify(result));
        });
    })
};

function votar(req, res) {
    console.log('votar work');

    let body = req.body;

    let idCompetencia = req.params.id;
    let idPelicula = body.idPelicula;

    conexion.query("INSERT INTO voto (competencia_id, pelicula_id) VALUES (?,?)", [idCompetencia, idPelicula],
        function (err, results) {
            if (err) {
                console.log("error" + err)
                return res.status(404).json('No se encuentra los datos');
            };
        res.send(JSON.stringify(results));
    });
};

function resultadosCompetencias(req,res){
    console.log('resultadosCompetencias Work')

    var idCompetencia = req.params.id;

    conexion.query("SELECT * FROM competicion WHERE id = "+ idCompetencia, function (err, competencia) {
        if (err) {
            console.log("error" + err)
            return res.status(404).send('No se encuentra la competencia con id seleccionado');
        };

    var sql = "SELECT pelicula_id, poster, titulo, count(*) as votos FROM pelicula p LEFT " +
        "JOIN voto v ON p.id = v.pelicula_id GROUP BY pelicula_id ORDER BY votos DESC LIMIT 3";

        conexion.query(sql, function (err, results) {
            if (err) {
                console.log("error" + err)
                return res.status(404).send('No se encuentran las peliculas correspondientes a la competencia');
            };
            
            const result = {
                'competencia': competencia[0].nombre,
                'resultados': results
            }
            res.send(JSON.stringify(result));
        })
    })
};

function crearNuevaCompetencia(req, res){
    let body = req.body;

    var nombre = body.nombre !== '0' ? body.nombre : null;
    var genero = body.genero !== '0' ? body.genero : null;
    var director = body.director !== '0' ? body.director : null;
    var actor = body.actor !== '0' ? body.actor : null;

    if (!nombre) return res.status(404).send("El nombre de la competencia no es compatible");

    var sql = "SELECT pelicula.id, poster, titulo FROM pelicula " +
        "JOIN director_pelicula ON pelicula_id = pelicula.id " +
        "JOIN actor_pelicula ON actor_pelicula.pelicula_id = pelicula.id " +
    "WHERE true = true ";

        if(genero) sql = sql + " AND genero_id = " + genero;
        if(director) sql = sql + " AND director_id = " + director;
        if(actor) sql = sql + " AND actor_id = " + actor;

        console.log(sql) //!--

        conexion.query(sql, function(err, peliculas){
            if (err) {
                console.log("error" + err)
                return res.status(404).send('No se encuentran peliculas que coincidan con los filtros seleccionados');
            };

            //!aca esta el problema los datos que no esten no los tengo que pasar!
            console.log(nombre, director, genero, actor)
            console.log(peliculas.length)

            if (peliculas.length < 2) return res.status(422).send("No se puede crear la competencia. No hay al menos dos peliculas con el criterio elegido");

            var sql = "INSERT INTO competicion (`nombre`, `genero_id`, `director_id`, `actor_id`) VALUES ('"+nombre+"',"+genero+","+director+","+actor+");";

            conexion.query(sql,
                function (err, results) {
                    if (err) {
                        console.log("error" + err)
                        return res.status(404).json('Error al insertar nueva competencia');
                    };
                    res.send(JSON.stringify(results));
                });
        })
};

function cargarGeneros(req, res){
    var sql = "SELECT * FROM genero;"

    conexion.query(sql, function (err, genero){
        if(err) {
            console.log("error" + err)
            return res.status(404).send('No se encuentra los generos');
        };
        res.send(JSON.stringify(genero));
    })
};

function cargarDirectores(req, res) {
    var sql = "SELECT * FROM director;"

    conexion.query(sql, function (err, director) {
        if (err) {
            console.log("error" + err)
            return res.status(404).send('No se encuentra los directores');
        };
        res.send(JSON.stringify(director));
    })
}

function cargarActores(req, res) {
    var sql = "SELECT * FROM actor;"

    conexion.query(sql, function (err, actor) {
        if (err) {
            console.log("error" + err)
            return res.status(404).send('No se encuentra los actores');
        };
        res.send(JSON.stringify(actor));
    })
}

//!arreglar no me esta trayendo la informacion al front, me trae un json pero no me aparece en pantalla los datos 
function cargarCompetencia(req, res) {
    console.log('cargarCompetencia Work')

    var id = req.params.id;

    var sql = "SELECT * FROM competicion WHERE id= "+id+";"

    conexion.query(sql, function (err, competencia) {
        if (err) {
            console.log("error" + err)
            return res.status(404).send('La competencia que se quiere reiniciar no existe o no tiene votos');
        };
        res.send(JSON.stringify(competencia));
    })
}
//!----

function eliminarVotos(req, res) {
    console.log('eliminarVotos Work')

    var id = req.params.id;
    
    var sql= "DELETE FROM voto WHERE competencia_id ="+ id + ";"

    conexion.query(sql, function (err, votos) {
        if (err) {
            console.log("error" + err)
            return res.status(404).send('No se pueden eliminar los votos');
        };
        res.send(JSON.stringify(votos));
    })
}

function eliminarCompetencia(req, res) {
    console.log('eliminarCompetencia Work')

    var id_competencia = req.params.id;

    var sql = "DELETE FROM voto WHERE competencia_id =" + id_competencia + ";"

    conexion.query(sql, function (err, eliminarVotos) {
        if (err) {
            console.log("error" + err)
            return res.status(404).send('No se pueden eliminar los votos');
        };

        var sql = "DELETE FROM competicion WHERE id =" + id_competencia + ";"

        conexion.query(sql, function (err, eliminarCompetencia) {
            if (err) {
                console.log("error" + err)
                return res.status(404).send('No se pueden eliminar la competencia');
            };
            res.send(JSON.stringify(eliminarCompetencia));
        })
    })
}

//!exportamos las funciones de consulta

module.exports = {
    todasLasCompetencias: todasLasCompetencias,
    listarDosPeliculas: listarDosPeliculas,
    votar: votar,
    resultadosCompetencias: resultadosCompetencias,
    crearNuevaCompetencia: crearNuevaCompetencia,
    cargarGeneros: cargarGeneros,
    cargarDirectores: cargarDirectores,
    cargarActores: cargarActores,
    cargarCompetencia: cargarCompetencia,
    eliminarVotos: eliminarVotos,
    eliminarCompetencia: eliminarCompetencia
}