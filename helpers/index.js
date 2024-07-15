const dbValidators= require('./db-validators')
const generarJWT= require('./generar-jwt')
const googleVerify= require('./google-verify')
const encryptPassword= require('./encrypt')
const subirArchivo= require('./subir-archivo')

module.exports={
    ...dbValidators,
    ...generarJWT,
    ...googleVerify,
    ...encryptPassword,
    ...subirArchivo
}