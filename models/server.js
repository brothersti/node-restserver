const express = require('express')
var cors = require('cors')
const colors = require( 'colors')
const { dbConnection } = require('../database/config')

class Server {
    constructor() {
        this.app = express()
        this.port = process.env.PORT
        this.usuariosPath = '/api/usuarios'
        this.authPath = '/api/auth'

        // Conectar a bd
        this.conectarDB()

        // Middleware
        this.middlewares()

        // configuraciones de rutas
        this.routes()
    }


    async conectarDB() {
        await dbConnection()
    }

    middlewares() {
        // CORS
        this.app.use(cors())

        // Lectura y parseo del body
        this.app.use(express.json())

        this.app.use(express.static('public'))
    }

    routes() {
        this.app.use(this.authPath, require('../routes/auth'))
        this.app.use(this.usuariosPath, require('../routes/usuarios'))
    }


    listen() {
        this.app.listen(this.port, () => {
            console.log(`Example app listening on port ${this.port}`.gray)
        })
    }
}


module.exports = Server







