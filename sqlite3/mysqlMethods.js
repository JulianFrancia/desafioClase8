const knex = require('../options/mysql');

class mySqlMethods {

    constructor() {}

    createTable() {
        knex.schema.createTableIfNotExists('productos', table => {
            table.increments('id')
            table.string('title')
            table.string('price')
            table.string('thumbnail')
        })
        .then(() => console.log('tabla mysql creada!'))
        .catch((error) => console.log(error))
    }

    insertarFila(fila) {
        knex('productos').insert(fila)
        .then(() => {})
        .catch((error) => console.log(error))
    }

    async select() {
        let productos;
        await knex.from('productos').select('*')
        .then((rows) => {
            productos = rows
        })
        .catch((error) => {
            productos = {error: 'no hay productos cargados'};
        });
        return productos
    }

    async selectWhere(id) {
        let producto;
        await knex.from('productos').select('id').where('id','=',id)
        .then((rows) => {
            producto = rows[0];
        })
        .catch((error) => {
            console.log(error);
            producto = {error: 'no hay productos cargados'};
        })
        return producto
    }

    actualizar(id,title,price,thumbnail) {
        knex.from('productos').where('id', '=' ,id).update({title: title, price: price, thumbnail: thumbnail})
        .then(() => {})
        .catch(error => console.log(error))
    }

    borrar(id) {
        knex.from('productos').where('id', '=', id).del()
        .then(() => {})
        .catch(error => console.log(error))
    }
}

module.exports = mySqlMethods;