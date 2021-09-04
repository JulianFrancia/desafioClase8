class Productos {

    constructor(listaProductos) {
        this.listaProductos = listaProductos;
    }

    devolverLista() {
        return this.listaProductos.length !== 0 ? this.listaProductos : {error: 'no hay productos cargados'}
    }

    devolveUnProducto(id) {
        return this.listaProductos.find(e => e.id == id) ? this.listaProductos.find(e => e.id == id) : {error: 'producto no encontrado'}
    }

    guardarUnProducto(producto) {
        producto["id"] = this.listaProductos.length + 1;
        this.listaProductos.push(producto);
    }
}

export default Productos;