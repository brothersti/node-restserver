const bcryptjs = require('bcryptjs')

const encryptPassword = (password = '') => {
    const salt = bcryptjs.genSaltSync()
    return bcryptjs.hashSync(password, salt)
}

const isValidPassword = (password = '', userPass) => {
    return bcryptjs.compareSync(password, userPass)
}


module.exports = {
    encryptPassword,
    isValidPassword
}