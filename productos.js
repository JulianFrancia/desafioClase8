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

    editarUnProducto(id,title, price, thumbnail) {
        let pos = this.listaProductos.indexOf(this.devolveUnProducto(id));
        pos != -1 ? this.listaProductos[pos] = {title,price,thumbnail,id} : null;
    }

    borrarUnProducto(id) {
        this.listaProductos.splice(this.listaProductos.indexOf(this.devolveUnProducto(id)),1)
    }
}

export default Productos;