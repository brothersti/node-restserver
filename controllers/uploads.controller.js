const path = require('path')
const fs = require('fs')
const cloudinary = require('cloudinary').v2

const { response } = require('express');
const { subirArchivo } = require('../helpers');
const { Usuario, Producto } = require('../models');

cloudinary.config(process.env.CLOUDINARY_URL)

const cargarArchivo = async (req, res = response) => {
    try {
        const nombre = await subirArchivo(req.files)

        res.json({
            nombre
        })

    } catch (msg) {
        res.status(400).json({ msg })
    }
}

const actualizarImagen = async (req, res = response) => {
    const { id, coleccion } = req.params
    let modelo

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id)
            if (!modelo) {
                return res.status(400).json({
                    msg: `No esxiste un usuario con el id ${id}`
                })
            }
            break;

        case 'productos':
            modelo = await Producto.findById(id)
            if (!modelo) {
                return res.status(400).json({
                    msg: `No esxiste un producto con el id ${id}`
                })
            }
            break;

        default:
            return res.status(500).json({ msg: 'No validé esa parte' })
    }

    //limpiar imagenes previas
    try {
        if (modelo.img) {
            const pathImagen = path.join(__dirname, '../uploads/imgs', coleccion, modelo.img)
            if (fs.existsSync(pathImagen)) {
                fs.unlinkSync(pathImagen)
            }
        }

        const nombreArchivo = await subirArchivo(req.files, undefined, coleccion)
        modelo.img = nombreArchivo

        await modelo.save()

        res.json({ modelo })
    } catch (error) {
        res.json({ error })
    }
}

const mostrarImagen = async (req, res = response) => {
    const { id, coleccion } = req.params
    let modelo

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id)
            if (!modelo) {
                return res.status(400).json({
                    msg: `No esxiste un usuario con el id ${id}`
                })
            }
            break;

        case 'productos':
            modelo = await Producto.findById(id)
            if (!modelo) {
                return res.status(400).json({
                    msg: `No esxiste un producto con el id ${id}`
                })
            }
            break;

        default:
            return res.status(500).json({ msg: 'No validé esa parte' })
    }

    //limpiar imagenes previas
    try {
        if (modelo.img) {
            return res.json({ url_img: modelo.img })
            // const pathImagen = path.join(__dirname, '../uploads/imgs', coleccion, modelo.img)
            // if (fs.existsSync(pathImagen)) {
            // }
        }

        const notFoundPath = path.join(__dirname, '../assets/no-image.jpg')
        return res.sendFile(notFoundPath)

    } catch (error) {
        res.json({ error })
    }
}

const updateImgCloudinary = async (req, res = response) => {
    const { id, coleccion } = req.params
    let modelo

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id)
            if (!modelo) {
                return res.status(400).json({
                    msg: `No esxiste un usuario con el id ${id}`
                })
            }
            break;

        case 'productos':
            modelo = await Producto.findById(id)
            if (!modelo) {
                return res.status(400).json({
                    msg: `No esxiste un producto con el id ${id}`
                })
            }
            break;

        default:
            return res.status(500).json({ msg: 'No validé esa parte' })
    }

    //limpiar imagenes previas
    try {
        if (modelo.img) {
            const nombreArr = modelo.img.split('/')
            const nombre = nombreArr[nombreArr.length - 1]
            const [public_id] = nombre.split('.')
            cloudinary.uploader.destroy(public_id)
        }

        const { tempFilePath } = req.files.archivo
        const { secure_url } = await cloudinary.uploader.upload(tempFilePath)

        // const nombreArchivo = await subirArchivo(req.files, undefined, coleccion)
        modelo.img = secure_url
        await modelo.save()

        res.json(modelo)

    } catch (error) {
        res.json({ error })
    }
}



module.exports = {
    actualizarImagen,
    cargarArchivo,
    mostrarImagen,
    updateImgCloudinary
}