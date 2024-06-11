const { Router } = require('express')
const { check } = require('express-validator')

const { validarCampos } = require('../middleware/validar-campos')
const { isValidRol, isEmailExist, isIdUserExist } = require('../helpers/db-validators')

const {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete,
    usuariosPatch
} = require('../controllers/usuarios.controller')

const router = Router()

router.get('/', usuariosGet)

router.post('/',
    [
        check('nombre', 'El nombre es obligatorio.').not().isEmail(),
        check('password', 'La contraseña debe de ser más de 6 caracteres.').isLength({ min: 6 }),
        check('correo').custom(isEmailExist),
        check('rol').custom(isValidRol),
        validarCampos
    ],
    usuariosPost)

router.put('/:id',
    [
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom(isIdUserExist),
        check('rol').custom(isValidRol),
        validarCampos
    ],
    usuariosPut)

router.patch('/', usuariosPatch)

router.delete('/:id',
    [
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom(isIdUserExist),
        validarCampos
    ],
    usuariosDelete)


module.exports = router