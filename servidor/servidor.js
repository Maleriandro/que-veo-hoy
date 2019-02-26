//paquetes necesarios para el proyecto
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var controlador = require('./controladores/controlador.js');

var app = express();

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

//seteamos el puerto en el cual va a escuchar los pedidos la aplicación
var puerto = '8080';

app.listen(puerto, function () {
  console.log( "Escuchando en el puerto " + puerto );
});

app.get('/', controlador.getHome);
app.get('/peliculas', controlador.getMovies);
app.get('/generos', controlador.getGenres);
app.get('/peliculas/recomendacion', controlador.getRecomended);
app.get('/peliculas/:id', controlador.getOneMovie);