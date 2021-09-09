import express from 'express';
import Productos from './productos.js';

const app = express();
const PORT = 8080;
const router = express.Router();
let listaProductos = []
const productos = new Productos(listaProductos);

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/api', router);
app.use(express.static('public'));

const server = app.listen(PORT, () => {
    console.log(`server escuchando en ${server.address().port}`)
})

server.on('error',error => console.log(`error en el server: ${error}`))


router.get('/productos/listar', (req,res) => {
    res.json(productos.devolverLista());
});

router.get('/productos/listar/:id', (req,res) => {
    res.json(productos.devolveUnProducto(req.params.id))
});

router.post('/productos/guardar', (req,res) => {
    productos.guardarUnProducto(req.body);
    res.json(req.body);
})

router.put('/productos/actualizar/:id', async (req,res) => {
    await productos.editarUnProducto(req.params.id, req.body.title, req.body.price, req.body.thumbnail);
    res.json(productos.devolveUnProducto(req.params.id));
})

router.delete('/productos/borrar/:id', async (req,res) => {
    await res.json(productos.devolveUnProducto(req.params.id));
    productos.borrarUnProducto(req.params.id);
})