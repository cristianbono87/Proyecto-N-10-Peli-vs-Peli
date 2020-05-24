//!aqui creamos la referencia a la base de datos
const conexion = require('../conexion/conexion_db');

//!programacion de los pedidos a la base de datos

function todasLasCompetencias(req, res) {
console.log('todasLasCompetencias work');

  var sql = "select * from competicion";

  conexion.query(sql, function (err, results, fields) {
        if (err) {
            console.log("error" + err)
            return res.status(404).json('No se encuentra los datos');
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
            "JOIN actor_pelicula ON actor_pelicula.pelicula_id = pelicula.id"
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
                return res.status(404).send('No se encuentra los datos');
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
            console.log(results)
        res.send(JSON.stringify(results));
    });
};

function resultadosCompetencias(req,res){
    console.log('resultadosCompetencias Work')

    var idCompetencia = req.params.id;

    conexion.query("SELECT * FROM competicion WHERE id = "+ idCompetencia, function (err, competencia) {
        if (err) {
            console.log("error" + err)
            return res.status(404).send('No se encuentra los datos');
        };

    var sql = "SELECT pelicula_id, poster, titulo, count(*) as cantidad_votos FROM pelicula p LEFT " +
        "JOIN voto v ON p.id = v.pelicula_id GROUP BY pelicula_id ORDER BY cantidad_votos DESC";

        conexion.query(sql, function (err, results) {
            if (err) {
                console.log("error" + err)
                return res.status(404).send('No se encuentra los datos');
            };

            console.log(results)
            const result = {
                'competencia': competencia[0].nombre,
                'resultados': results
            }
            res.send(JSON.stringify(result));
        })
    })
};

//!exportamos las funciones de consulta

module.exports = {
    todasLasCompetencias: todasLasCompetencias,
    listarDosPeliculas: listarDosPeliculas,
    votar: votar,
    resultadosCompetencias: resultadosCompetencias
}