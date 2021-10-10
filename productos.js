const mySql = require('./sqlite3/mysqlMethods');
const mysqlController = new mySql();

class Productos {

    constructor(listaProductos) {
        this.listaProductos = listaProductos;
        mysqlController.createTable();
    }

    async devolverLista() {
        let productosDevueltos;
        await mysqlController.select().then(productos => {productosDevueltos = productos});
        return productosDevueltos;
    }

    async devolveUnProducto(id) {
        let producto;
        await mysqlController.selectWhere(id).then(prod => {producto = prod});
        return producto;
    }

    guardarUnProducto(producto) {
        producto["id"] = this.listaProductos.length + 1;
        this.listaProductos = [];
        this.listaProductos.push(producto);
        mysqlController.insertarFila(this.listaProductos)
    }

    editarUnProducto(id,title, price, thumbnail) {
        mysqlController.actualizar(id,title, price, thumbnail);
    }

    borrarUnProducto(id) {
        mysqlController.borrar(id);
    }
}

module.exports = Productos;