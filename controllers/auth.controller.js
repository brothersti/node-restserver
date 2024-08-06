const { response } = require("express")
const Usuario = require('../models/usuario')
const { isValidPassword } = require("../helpers/encrypt")
const { generarJWT } = require("../helpers/generar-jwt")
const { googleVerify } = require('../helpers/google-verify')



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


const googleSignIn = async (req, res = response) => {
    const { id_token } = req.body

    try {
        const { nombre, correo, img } = await googleVerify(id_token)
        // console.log({ nombre, correo, img })

        let usuario = await Usuario.findOne({ correo })


        if (!usuario) {
            // console.log('Usuario nuevo', usuario)

            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                rol: "USER_ROLE",
                google: true
            }

            usuario = new Usuario(data)

            await usuario.save()
        }

        // console.log(usuario.estado)

        // si el usuario esta activo
        if (!usuario.estado) {
            return res.status(401).json({
                msg: `Hable con el administrador , usuario bloqueado. `
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
        res.status(400).json({
            msg: 'El token no se pudo verificar.'
        })
    }
}


const renovarToken = async (req, res = response) => {
    const { usuario } = req

   // genera el jwt
   const token = await generarJWT(usuario.id)

    res.json({
        usuario,
        token
    })
}

module.exports = {
    login,
    googleSignIn,
    renovarToken
}