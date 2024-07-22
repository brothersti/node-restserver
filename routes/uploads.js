const { Router } = require('express')
const { check } = require('express-validator')
const { cargarArchivo, actualizarImagen, mostrarImagen, updateImgCloudinary } = require('../controllers/uploads.controller')
const { validarCampos } = require('../middleware')
const { coleccionesPermitidas } = require('../helpers/db-validators')
const { validarArchivo } = require('../middleware/validar-archivo')


const router = Router()

router.post('/', validarArchivo, cargarArchivo)

router.put('/:coleccion/:id', [
    validarArchivo,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], updateImgCloudinary)
// actualizarImagen)

router.get('/:coleccion/:id', [
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], mostrarImagen)



module.exports = router