const db = require('../lib/conexionbd.js')

function getMovies(req, res) {
    const query = `
        SELECT * FROM pelicula
    `

    db.query(query, function(error, rows) {
        var response = {
            peliculas: rows,
            total: rows.length
        };

        res.send(response);
    })

    
    
}

module.exports = {
    getMovies : getMovies
}