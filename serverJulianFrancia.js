import express from 'express';
import Productos from './productos.js';

const app = express();
const PORT = 8080;
let listaProductos = []
const productos = new Productos(listaProductos);

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const server = app.listen(PORT, () => {
    console.log(`server escuchando en ${server.address().port}`)
})

server.on('error',error => console.log(`error en el server: ${error}`))


app.get('/api/productos/listar', (req,res) => {
    res.json(productos.devolverLista());
});

app.get('/api/productos/listar/:id', (req,res) => {
    res.json(productos.devolveUnProducto(req.params.id))
});

app.post('/api/productos/guardar', (req,res) => {
    productos.guardarUnProducto(req.body);
    res.json(req.body);
})