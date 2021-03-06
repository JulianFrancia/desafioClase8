const express = require('express');
const handlebars = require('express-handlebars')
const Productos = require('./productos');

const app = express();
const PORT = process.env.PORT;
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

server.on('error',error => console.log(`error en el server: ${error}`));

app.engine(
    "hbs",
    handlebars({
        extname: ".hbs",
        defaultLayout: "index.hbs",
        productosDir: __dirname + "/views/layouts",
        partialsDir: __dirname + "/views/partials"
    })
);

app.set('views', './views');
app.set('view engine', 'hbs');


router.get('/productos/listar', (req,res) => {
    res.json(productos.devolverLista());
});

router.get('/productos/listar/:id', (req,res) => {
    res.json(productos.devolveUnProducto(req.params.id))
});

router.get('/productos/vista', (req, res) => {
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