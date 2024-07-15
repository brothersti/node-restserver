const { response } = require("express");
const { Categoria } = require("../models");

//paginado - total- populate
const obtenerCategorias = async (req, res = response) => {
    const { limite = 5, desde = 0 } = req.query
    const query = { estado: true }

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .populate('usuario', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ])

    res.json({
        total,
        categorias
    })
}

//populate
const obtenerCategoria = async (req, res = response) => {
    const { id } = req.params

    const categoria = await Categoria.findById(id)
        .populate('usuario', 'nombre')

    return res.json(categoria)
}


const crearCategorias = async (req, res = response) => {
    const nombre = req.body.nombre.toUpperCase()
    const categoriaDB = await Categoria.findOne({ nombre })

    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe`
        })
    }

    //genera la data
    const data = {
        nombre,
        usuario: req.usuario._id //id de mongo
    }

    const categoria = new Categoria(data)

    //guardar en db
    await categoria.save()

    res.status(201).json({
        msg: 'Categoria creada'
    })
}

//update
const actualizarCategoria = async (req, res = response) => {
    const { id } = req.params
    const { estado, usuario, ...data } = req.body

    data.nombre = data.nombre.toUpperCase()
    data.usuario = req.usuario._id

    await Categoria.findByIdAndUpdate(id, data, { new: true })

    res.json({
        msg: 'Categoria actualizada correctamente'
    })
}


//delete - estado:false
const borrarCategoria = async (req, res = response) => {
    const { id } = req.params
    await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true })

    res.json({
        msg:'Categoria borrada.'
    })
}



module.exports = {
    crearCategorias,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria,
}