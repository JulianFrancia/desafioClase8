const express = require('express');
const handlebars = require('express-handlebars');
const Productos = require('./productos');
const moment = require('moment');
const fs = require('fs');
const mongoose = require('mongoose');
const mensajesModel = require('./models/mensajes-model');
const {normalize, schema} = require('normalizr');
const session =  require('express-session');
const { max } = require('moment');


const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const PORT = 8080;
const router = express.Router();
const newRouter = express.Router();

let listaProductos = []
const productos = new Productos(listaProductos);
let mensajes = [];

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/', newRouter);
app.use('/api', router);
app.use(session({
    secret:'secreto',
    resave: true,
    saveUninitialized: true,
    cookie: {maxAge:60000}
}))

const server = http.listen(PORT, () => {
    console.log(`server escuchando en ${server.address().port}`)
})

server.on('error',error => console.log(`error en el server: ${error}`));

const connectDatabase = () => {
    const URI = 'mongodb://localhost:27017/ecommerce';
    mongoose.connect(URI, 
        { 
          useNewUrlParser: true,
          useUnifiedTopology: true,
          serverSelectionTimeoutMS: 1000
        })
    .then(()=>console.log('Conectado a la base de datos...'))
}

connectDatabase();

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
        const mensajeNuevo = {email: data.mail, text: data.text};
        const mensajeSchema = new schema.Entity('mensaje');
        const normalizeMensaje = normalize(mensajeNuevo,mensajeSchema);
        const mensajeSaveModel = new mensajesModel.Mensaje(normalizeMensaje);
        mensajeSaveModel.save();
        fs.writeFileSync('mensajes.txt', JSON.stringify(mensajes));
        io.sockets.emit('mostrarMensajes', mensajes);
    });
    socket.on('login', data => {
        console.log(data)
    })
})

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


router.get('/productos/vista-test/:id', (req,res) => {
    res.json(productos.devolverMock(req.query.cant))
})

router.get('/productos/listar', (req,res) => {
    productos.devolverLista().then( prods => res.json(prods));
});

router.get('/productos/listar/:id', (req,res) => {
    productos.devolveUnProducto(req.params.id).then(prod => {
        res.json(prod)
    })
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
    productos.devolveUnProducto(req.params.id).then(prod => {
        res.json(prod)
    })
})

router.delete('/productos/borrar/:id', async (req,res) => {
    await productos.devolveUnProducto(req.params.id).then(prod => {
        res.json(prod)
    })
    productos.borrarUnProducto(req.params.id);
})

app.get('/login', (req,res) => {
    if(req.query.usuario) {
        req.session.admin = true;
        req.session.usuario = req.query.usuario; 
        res.send('login exitoso')
    } else {
        res.send('fallo el login')
    }
})

app.get('/isLogged', (req,res) => {
    if(req.session.admin) {
        res.send({usuario: req.session.usuario, isLogged: true})
    } else {
        res.send({isLogged: false})
    }
})

app.get('/logout', (req,res) => {
    req.session.destroy();
    res.send('logout')
    console.log('deslogueado')
})