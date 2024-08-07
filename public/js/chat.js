
var url = (window.location.hostname.includes('localhost'))
    ? 'http://localhost:8080/api/auth/'
    : 'https://restserver-curso-fher.herokuapp.com/api/auth/';


//Referencias htlm
const txtUid = document.querySelector("#txtUid")
const txtMensaje = document.querySelector("#txtMensaje")
const ulUsuarios = document.querySelector("#ulUsuarios")
const ulMensajes = document.querySelector("#ulMensajes")
const btnSalir = document.querySelector("#btnSalir")

let usuario = null
let token = null


const validarJWR = async () => {
    const token = localStorage.getItem('token') || ''


    if (token.length <= 10) {
        window.location = 'index.html'
        throw new Error('No hay token en el servidor')
    }

    const resp = await fetch(url, {
        headers: { 'x-token': token }
    })

    const { usuario: userDB, token: tokenDB } = await resp.json()
    localStorage.setItem('token', token)
    usuario = userDB

    document.title = usuario.nombre

    await conectarSocket()
}

const conectarSocket = async () => {
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    })

    socket.on('connect', () => {

    })

    socket.on('disconnect', () => {

    })

    socket.on('recibir-mensajes', mostrarMensajes)
    socket.on('usuarios-activos', mostrarUsuarios)

    socket.on('mensaje-privado', (payload) => {
        console.log(payload)
    })
}


const mostrarUsuarios = (usuarios = []) => {
    let usersHtml = ''
    usuarios.forEach(({ nombre, uid }) => {
        usersHtml += `
        <li>
            <p>
                <h5 class="text-success"> ${nombre}</h5>
                <span class="fs-6 text-muted">${uid}</span>
            </p>
        </li>
        `
    })

    ulUsuarios.innerHTML = usersHtml
}


const mostrarMensajes = (mensajes = []) => {
    let mensajeHtml = ''
    mensajes.forEach(({ nombre, mensaje }) => {
        mensajeHtml += `
        <li>
            <p>
                <span class="text-primary"> ${nombre}</span>
                <span >${mensaje}</span>
            </p>
        </li>
        `
    })

    ulMensajes.innerHTML = mensajeHtml
}

txtMensaje.addEventListener('keyup', ({ keyCode }) => {
    const mensaje = txtMensaje.value.trim()
    const uid = txtUid.value.trim()

    if (keyCode !== 13) { return }
    if (mensaje.length === 0) { return }

    socket.emit('enviar-mensaje', { mensaje, uid })

    txtMensaje.value = ''
})

const main = async () => {
    await validarJWR()

}



main()