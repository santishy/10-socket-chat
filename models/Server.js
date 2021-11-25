const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');
const fileUpload = require('express-fileupload');
const {createServer} = require('http');
const {socketController} = require('../sockets/controller')

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.server = createServer(this.app)
        this.io = require('socket.io')(this.server);
        this.conectarDB()
        this.middleware();
        this.routes();
        this.sockets();
    }

    async conectarDB(){
        await dbConnection()
    }

    middleware() {

        this.app.use(cors());
        //para que parsee y formatie el json enviado en las peticiones.
        this.app.use(express.json());
        //sirve lo que esta en la carpeta public, e ignora la ruta principal / 
        this.app.use(express.static('public'));

        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));

    }

    routes() {
        this.app.use('/api/usuarios',require('../routes/user'));
        this.app.use('/api/auth',require('../routes/auth'));
        this.app.use('/api/categories',require('../routes/categories'));
        this.app.use('/api/products',require('../routes/products'));
        this.app.use('/api/search',require('../routes/search'));
        this.app.use('/api/uploads',require('../routes/uploads'));
    }
    sockets(){
        this.io.on('connection',socketController);
    }
    listen() {
        this.server.listen(this.port, () => {
            console.log('express esta corriendo en el puerto ', this.port)
        });
    }
}

module.exports = Server;