const { response } = require('express')


const Usuario = require('../models/usuario')
const { encryptPassword } = require('../helpers/encrypt')


const usuariosGet = async (req, res = response) => {
    const { limite = 5, desde = 0 } = req.query
    const query = { estado: true }

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ])

    res.json({
        total,
        usuarios
    })
}

const usuariosPost = async (req, res = response) => {

    const { nombre, correo, password, rol } = req.body
    const usuario = new Usuario({ nombre, correo, password, rol })

    //Encriptar password
    usuario.password = encryptPassword(password)

    //Guardar en bd
    await usuario.save()

    res.json(usuario)
}

const usuariosPut = async (req, res = response) => {
    const { id } = req.params
    const { password, google, correo, ...resto } = req.body

    if (password) {
        resto.password = encryptPassword(password)
    }

    const usuarioDb = await Usuario.findByIdAndUpdate(id, resto)

    res.json(usuarioDb)
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - controlador'
    })
}

const usuariosDelete = async (req, res = response) => {
    const { id } = req.params

    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false })
    res.json({
        msg: 'Usuario eliminado correctamente.'
    })
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}