const { response } = require("express")
const Usuario = require('../models/usuario')
const { isValidPassword } = require("../helpers/encrypt")
const { generarJWT } = require("../helpers/generar-jwt")



const login = async (req, res = response) => {
    const { correo, password } = req.body

    try {

        // Verificar si el email existe
        const usuario = await Usuario.findOne({ correo })
        if (!usuario) {
            return res.status(400).json({
                msg: `El usuario ${correo}, no existe. `
            })
        }

        // si el usuario esta activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: `El usuario ${correo}, no esta activo. `
            })
        }

        // verificar la contraseña
        const isValidPass = isValidPassword(password, usuario.password)
        if (!isValidPass) {
            return res.status(400).json({
                msg: `La contraseña no es válida. `
            })
        }

        // genera el jwt
        const token = await generarJWT(usuario.id)


        res.json({
            usuario,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }
}


module.exports = {
    login
}