const Role = require("../models/role")
const Usuario = require('../models/usuario')



const isValidRol = async (rol = '') => {
    const existRol = await Role.findOne({ rol })
    if (!existRol) {
        throw new Error(`El rol ${rol} no está registrado en la base de datos.`)
    }
}


const isEmailExist = async (correo = '') => {
    const existEmail = await Usuario.findOne({ correo })
    if (existEmail) {
        throw new Error(`El correo: ${correo}, ya está registrado`)
    }
}

const isIdUserExist = async (id = '') => {
    const existUser = await Usuario.findById(id)
    if (!existUser) {
        throw new Error(`El id: ${correo}, no existe`)
    }
}


module.exports = {
    isValidRol,
    isEmailExist,
    isIdUserExist
}