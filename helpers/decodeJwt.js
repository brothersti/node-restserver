const jwt = require('jsonwebtoken')


function decodeJwtResponse(token) {
    try {
        // Decode the JWT without verifying the signature
        const decoded = jwt.decode(token, { complete: true });
        if (!decoded) {
            throw new Error('Token no válido');
        }
        return decoded;
    } catch (error) {
        console.error('Error al decodificar el JWT:', error);
        return null;
    }
}

module.exports = decodeJwtResponse;