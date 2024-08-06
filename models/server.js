const express = require('express')
var cors = require('cors')
const colors = require('colors')
const { dbConnection } = require('../database/config')
const fileUpload = require('express-fileupload')
const { createServer } = require('http')
const { socketController } = require('../sockets/socketController')

class Server {
    constructor() {
        this.app = express()
        this.port = process.env.PORT
        this.server = createServer(this.app)
        this.io = require('socket.io')(this.server)


        this.paths = {
            auth: '/api/auth',
            buscar: '/api/buscar',
            categorias: '/api/categorias',
            productos: '/api/productos',
            uploads: '/api/uploads',
            usuarios: '/api/usuarios'
        }

        // Conectar a bd
        this.conectarDB()

        // Middleware
        this.middlewares()

        // configuraciones de rutas
        this.routes()

        //Sockets
        this.sockets()
    }


    async conectarDB() {
        await dbConnection()
    }

    middlewares() {
        // CORS
        this.app.use(cors())

        // Lectura y parseo del body
        this.app.use(express.json())

        // Directorio publico
        this.app.use(express.static('public'))

        // Carga de archivo
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }))
    }

    routes() {
        this.app.use(this.paths.auth, require('../routes/auth'))
        this.app.use(this.paths.buscar, require('../routes/buscar'))
        this.app.use(this.paths.categorias, require('../routes/categorias'))
        this.app.use(this.paths.productos, require('../routes/productos'))
        this.app.use(this.paths.uploads, require('../routes/uploads'))
        this.app.use(this.paths.usuarios, require('../routes/usuarios'))
    }


    sockets() {
        this.io.on("connection", (socket) => socketController(socket, this.io))
    }

    listen() {
        this.server.listen(this.port, () => {
            console.log(`Listening on port ${this.port}`.gray)
        })
    }
}


module.exports = Server







