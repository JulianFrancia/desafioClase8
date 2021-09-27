import express from 'express';
import Productos from './productos.js'
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import * as handlebars from 'express-handlebars';
import moment from 'moment';
import fs from 'fs';

const app = express();
const serverHttp = http.Server(app)
const io = new Server(serverHttp);
const PORT = 8080;
const router = express.Router();
const newRouter = express.Router();
let listaProductos = []
const productos = new Productos(listaProductos);
let mensajes = [];
const __dirname = path.resolve();
let engine = handlebars.create({
    extname: ".hbs",
    defaultLayout: "index.hbs",
    productosDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials"
}).engine;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/', newRouter);
app.use('/api', router);

const server = serverHttp.listen(PORT, () => {
    console.log(`server escuchando en ${server.address().port}`)
})

server.on('error',error => console.log(`error en el server: ${error}`));

io.on('connection', (socket) => {
    socket.emit('mostrarProductos', productos.devolverLista());
    socket.emit('mostrarMensajes', mensajes)
    socket.on('guardarProducto', data => {
        productos.guardarUnProducto(data);
        io.sockets.emit('mostrarProductos', productos.devolverLista())
    });
    socket.on('enviar', data => {
        data['fecha'] = moment().format('DD/MM/YYYY, h:mm:ss a');
        mensajes.push(data);
        fs.writeFileSync('mensajes.txt', JSON.stringify(mensajes));
        io.sockets.emit('mostrarMensajes', mensajes);
    });
})

app.engine(
    "hbs",
    engine
);

app.set('views', './views');
app.set('view engine', 'hbs');


router.get('/productos/listar', (req,res) => {
    res.json(productos.devolverLista());
});

router.get('/productos/listar/:id', (req,res) => {
    res.json(productos.devolveUnProducto(req.params.id))
});

newRouter.get('/', (req, res) => {
    let listExist = productos.devolverLista().length > 0 ? true : false;
    res.render('main',{listaProd: productos.devolverLista(), listExist: listExist, listNotExist: !listExist});
})

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