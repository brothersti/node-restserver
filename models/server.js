const express = require('express')
var cors = require('cors')

class Server {
    constructor() {
        this.app = express()
        this.port = process.env.PORT
        this.usuariosPath = '/api/usuarios'

        // Middleware
        this.middlewares()

        // configuraciones de rutas
        this.routes()
    }

    middlewares() {
        // CORS
        this.app.use(cors())

        // Lectura y parseo del body
        this.app.use(express.json())

        this.app.use(express.static('public'))
    }

    routes() {
        this.app.use(this.usuariosPath, require('../routes/usuarios'))
    }


    listen() {
        this.app.listen(this.port, () => {
            console.log(`Example app listening on port ${this.port}`)
        })
    }
}


module.exports = Server







