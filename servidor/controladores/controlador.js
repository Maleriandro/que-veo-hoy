const db = require('../lib/conexionbd.js');

function getHome(req, res) {
    res.send('Hello World!');
}

function getMovies(req, res) {
    const pagina = req.query.pagina - 1;
    const titulo = req.query.titulo;
    const genero = req.query.genero;
    const anio = req.query.anio;
    const cantidad = req.query.cantidad;
    const columnaOrden = req.query.columna_orden;
    const tipoOrden = req.query.tipo_orden;   

    let query = `
        SELECT pelicula.id, titulo, poster, trama
        FROM pelicula
        JOIN genero ON pelicula.genero_id = genero.id
        WHERE true
    `;
    
    if (titulo) {
        query += `AND titulo LIKE '%${titulo}%' `;
    }

    if (genero) {
        query += `AND genero_id = '${genero}' `;
    }
    
    if (anio) {
        query += `AND anio = ${anio} `;
    }

    query += `
            ORDER BY ${columnaOrden} ${tipoOrden}
            LIMIT ${pagina * cantidad},${cantidad}
    `;

    db.query(query, function(error, rows) {
        const sendData = respuesta(error, rows, res);

        if (sendData) {
            const response = {
            peliculas: rows,
            total: rows.length
            };

            res.send(response);
        }
    });    
}

function getGenres(req, res) {
    const query = `
    SELECT id, nombre
    FROM genero;
    `;

    db.query(query, function(error, rows) {
        const sendData = respuesta(error, rows, res);

        if (sendData) {
            const response = {
                generos: rows
            }
    
            res.send(response);
        }
    });
}

function getOneMovie(req, res) {
    const idPelicula = req.params.id;

    const query = `
        SELECT titulo, duracion, director, anio, fecha_lanzamiento, puntuacion, poster, trama, genero.nombre
        FROM pelicula
        JOIN genero ON pelicula.genero_id = genero.id
        WHERE pelicula.id = ${idPelicula};
    `

    db.query(query, function(errorPelicula, rowsPelicula) {
        
        const executeSecondQuery = respuesta(errorPelicula, rowsPelicula, res);

        if (!executeSecondQuery) {
            return;
        }

        const queryActores = `
            SELECT actor.nombre
            FROM actor_pelicula
            JOIN actor ON actor_pelicula.actor_id = actor.id
            WHERE pelicula_id = ${idPelicula};
        `;

        db.query(queryActores, function(errorActores, rowsActores) {
            const sendData = respuesta(errorActores, rowsActores, res);

            if (sendData) {
                const response = {
                    pelicula: rowsPelicula[0],
                    actores: rowsActores
                }
    
                res.send(response);
            }   
        });
    });
}

function getRecomended(req, res) {
    const anioInicio = req.query.anio_inicio;
    const anioFin = req.query.anio_fin;
    const puntuacion = req.query.puntuacion;
    const genero = req.query.genero;

    let query = `
        SELECT pelicula.id, titulo, poster, trama, genero.nombre
        FROM pelicula
        JOIN genero ON pelicula.genero_id = genero.id
        WHERE true
    `;

    if (anioInicio && anioFin) {
        query += `AND anio BETWEEN ${anioInicio} AND ${anioFin} `;
    }

    if (puntuacion) {
        query += `AND puntuacion >= ${puntuacion} `;
    }

    if (genero) {
        query+= `AND genero.nombre = '${genero}' `;
    }

    db.query(query, function(error, rows) {
        const sendData = respuesta(error, rows, res);

        if (sendData) {

            const response = {
                peliculas : rows
            }
            res.send(response);
        }
    });
}

// Respuesta estandarizada para todas las peticiones a la base de datos
function respuesta(error, rows, res) {
	if (error) {
		res.status(500);

		res.send({
			message: error.message
		});

		return false;
	} else if (rows === 0) {
		res.status(404);

		res.send({
			reason: 'empty result'
		});

		return false;
	}

	return true;
}

module.exports = {
    getHome : getHome,
    getMovies : getMovies,
    getGenres : getGenres,
    getOneMovie: getOneMovie,
    getRecomended: getRecomended
}