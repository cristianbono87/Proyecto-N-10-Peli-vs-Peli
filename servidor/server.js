var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var controladorVs = require("./controladores/competenciasController");

var app = express();
app.use(cors());

var puerto = 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get("/competencias", controladorVs.todasLasCompetencias);
app.get("/competencias/:id/peliculas", controladorVs.listarDosPeliculas);
app.get('/competencias/:id/resultados', controladorVs.resultadosCompetencias);

app.post('/competencias/:id/voto', controladorVs.votar);

// app.get('/generos', competenciaController.cargarGeneros);
// app.get('/directores', competenciaController.cargarDirectores);
// app.get('/actores', competenciaController.cargarActores);

// app.get('/competencias', competenciaController.listarCompetencias);
// app.get('/competencias/:id/peliculas', competenciaController.obtenerPeliculasAleatorias);
// app.get('/competencias/:id', competenciaController.cargarCompetencia);

// app.post('/competencias', competenciaController.crearNuevaCompetencia);
// app.put('/competencias/:id', competenciaController.editarNombreCompetencia);
// app.delete('/competencias/:id/votos', competenciaController.eliminarVotos);
// app.delete('/competencias/:id', competenciaController.eliminarCompetencia);  

app.listen(puerto, function () {
    console.log("Escuchando en el puerto " + puerto);
});