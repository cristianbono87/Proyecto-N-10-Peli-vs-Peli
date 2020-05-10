//!aqui creamos la referencia a la base de datos
const conexion = require('../conexion/conexion_db');

//!programacion de los pedidos a la base de datos

function todasLasCompetencias(req, res) {
console.log('todasLasCompetencias work');
//   var titulo = req.query.titulo; //!despues borrar

  var sql = "select * from competicion";

  conexion.query(sql, function (err, results, fields) {
        if (err) {
            console.log("error" + err)
            return res.status(404).json('No se encuentra los datos');
        };
        // var data = {};
        // data = results;
        // res.send(JSON.stringify(data));
        res.json(results);
    });
};

//!exportamos las funciones de consulta

module.exports = {
    todasLasCompetencias: todasLasCompetencias
}