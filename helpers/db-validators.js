const {
    Categoria,
    Role,
    Usuario,
    Producto } = require("../models")



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
        throw new Error(`El id: ${id}, no existe`)
    }
}

const isIdCategoryExist = async (id = '') => {
    const existCategory = await Categoria.findById(id)
    if (!existCategory) {
        throw new Error(`El id no existe, ${id} `)
    }
}

const isIdProductExist = async (id = '') => {
    const existProducto = await Producto.findById(id)
    if (!existProducto) {
        throw new Error(`El id no existe, ${id} `)
    }
}

/**
 * Validar colecciones permitidas
 */
const coleccionesPermitidas = (coleccion = '', colecciones = []) => {
    const incluida = colecciones.includes(coleccion)
    if (!incluida) {
        throw new Error(`La colección ${coleccion} no es permitida. Colecciones permitidas: ${colecciones}`)
    }
    return true
}

module.exports = {
    coleccionesPermitidas,
    isValidRol,
    isEmailExist,
    isIdUserExist,
    isIdCategoryExist,
    isIdProductExist
}