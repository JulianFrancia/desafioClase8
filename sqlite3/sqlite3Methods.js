const knex = require('../options/sqlite3');

class Sqlite3Methods {

    constructor() {}

    createTable() {
        knex.schema.createTable('mensajes', table => {
            table.increments('id')
            table.string('text')
            table.string('mail')
            table.string('fecha')
        })
        .then(() => console.log('tabla sqlite creada!'))
        .catch((error) => console.log(error))
    }
    
    insertarFila(fila) {
        knex('mensajes').insert(fila)
        .then(() => {})
        .catch((error) => console.log(error))
    }

    async select() {
        let mensajes;
        await knex.from('mensajes').select('*')
        .then((rows) => {
            mensajes = rows 
        })
        .catch((error) => console.log(error));
        return mensajes
    }
}

module.exports = Sqlite3Methods;