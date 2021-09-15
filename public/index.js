function enviarProducto() {
    let form = document.getElementById('form');
    let title = document.getElementById('title');
    let precio = document.getElementById('price');
    let img = document.getElementById('thumbnail');
    let producto = {
        title: title.value,
        price: precio.value,
        thumbnail: img.value
    }
    fetch('http://localhost:8080/api/productos/guardar',{
        method:'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(producto)
    });
    form.reset()
}