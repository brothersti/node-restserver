const { Router } = require('express')
const { check } = require('express-validator')

const { validarCampos, validarJWT, isAdmin } = require('../middleware')
const { isIdProductExist, isIdCategoryExist } = require('../helpers/db-validators')

const {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto
} = require('../controllers/productos.controller')

const router = Router()

router.get('/', obtenerProductos)

router.get('/:id',
    [
        check('id', 'No es un id de Mongo válido').isMongoId(),
        check('id').custom(isIdProductExist),
        validarCampos
    ],
    obtenerProducto)

router.post('/',
    [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('categoria', 'No es un id de Mongo válido').isMongoId(),
        check('categoria').custom(isIdCategoryExist),
        validarCampos

    ], crearProducto)

router.put('/:id',
    [
        validarJWT,
        check('categoria', 'No es un id de Mongo válido').isMongoId(),
        check('id').custom(isIdProductExist),
        validarCampos
    ], actualizarProducto)

router.delete('/:id',
    [
        validarJWT,
        isAdmin,
        check('id', 'No es un id de Mongo válido').isMongoId(),
        check('id').custom(isIdProductExist),
        validarCampos
    ], borrarProducto)

module.exports = router