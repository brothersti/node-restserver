const { response } = require("express");
const { Producto } = require("../models");

//paginado - total- populate
const obtenerProductos = async (req, res = response) => {
    const { limite = 5, desde = 0 } = req.query
    const query = { estado: true }

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ])

    res.json({
        total,
        productos
    })
}

//populate
const obtenerProducto = async (req, res = response) => {
    const { id } = req.params

    const producto = await Producto.findById(id)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')

    return res.json(producto)
}


const crearProducto = async (req, res = response) => {

    const { estado, usuario, ...body } = req.body

    const productoDB = await Producto.findOne({ nombre: body.nombre })

    if (productoDB) {
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre}, ya existe`
        })
    }

    //genera la data
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id //id de mongo
    }

    const producto = new Producto(data)

    try {
        //guardar en db
        await producto.save()

        res.status(201).json({
            msg: 'Producto creado.'
        })

    } catch (error) {
        console.log(`${error}`.red)
        res.status(500).json({
            msg: `${error}`
        })
    }
}

//update
const actualizarProducto = async (req, res = response) => {
    const { id } = req.params
    const { estado, usuario, ...data } = req.body

    if (data.nombre) {
        data.nombre = data.nombre.toUpperCase()
    }

    data.usuario = req.usuario._id

    await Producto.findByIdAndUpdate(id, data, { new: true })

    res.json({
        msg: 'Producto actualizada correctamente'
    })
}


//delete - estado:false
const borrarProducto = async (req, res = response) => {
    const { id } = req.params
    await Producto.findByIdAndUpdate(id, { estado: false }, { new: true })

    res.json({
        msg: 'Producto borrado.'
    })
}



module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto,
}