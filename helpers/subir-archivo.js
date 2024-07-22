const { join } = require('path')
const { v4: uuidv4 } = require('uuid')


const subirArchivo = (files, extensionValidas = ['png', 'jpg', 'jpeg', 'gif'], coleccion) => {

    return new Promise((resolve, reject) => {
        const { archivo } = files;

        const shortName = archivo.name.split('.')
        const extension = shortName[shortName.length - 1]

        if (!extensionValidas.includes(extension)) {

            return reject(`La extensión ${extension} no es permitida.`)
        }

        try {
            let uploadPath
            const nombreTemp = `${uuidv4()}.${extension}`

            switch (extension) {
                case 'txt':
                case 'md':
                case 'pdf':
                    uploadPath = join(__dirname, '../uploads/', 'textos',coleccion, nombreTemp)
                    console.log(uploadPath)
                    break;

                case 'png':
                case 'jpg':
                case 'jpeg':
                case 'gif':
                    uploadPath = join(__dirname, '../uploads/', 'imgs', coleccion, nombreTemp)
                    break;

                default:
                    break;
            }


            archivo.mv(uploadPath, (err) => {
                if (err) {
                    reject(err)
                }

                resolve(nombreTemp)
            });

        } catch (error) {
            console.log(error)
        }
    })
}




module.exports = {
    subirArchivo
}