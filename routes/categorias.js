const { Router } = require('express')
const { check } = require('express-validator')

const { validarCampos, validarJWT, isAdmin } = require('../middleware')
const { isIdCategoryExist } = require('../helpers/db-validators')

const {
    obtenerCategorias,
    obtenerCategoria,
    crearCategorias,
    actualizarCategoria,
    borrarCategoria
} = require('../controllers/categorias.controller')

const router = Router()

router.get('/', obtenerCategorias)

router.get('/:id',
    [
        check('id', 'No es un id de Mongo válido').isMongoId(),
        check('id').custom(isIdCategoryExist),
        validarCampos
    ],
    obtenerCategoria)

router.post('/',
    [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        validarCampos

    ], crearCategorias)

router.put('/:id',
    [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('id').custom(isIdCategoryExist),
        validarCampos
    ], actualizarCategoria)

router.delete('/:id',
    [
        validarJWT,
        isAdmin,
        check('id', 'No es un id de Mongo válido').isMongoId(),
        check('id').custom(isIdCategoryExist),
        validarCampos
    ], borrarCategoria)

module.exports = router