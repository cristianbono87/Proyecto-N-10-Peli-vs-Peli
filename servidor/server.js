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

app.listen(puerto, function () {
    console.log("Escuchando en el puerto " + puerto);
});