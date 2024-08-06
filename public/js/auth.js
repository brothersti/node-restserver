const myForm = document.querySelector('form')


var url = (window.location.hostname.includes('localhost'))
    ? 'http://localhost:8080/api/auth/'
    : 'https://restserver-curso-fher.herokuapp.com/api/auth/';



myForm.addEventListener('submit', ev => {
    ev.preventDefault()
    const formData = {}

    for (let el of myForm.elements) {
        if (el.name.length > 0)
            formData[el.name] = el.value
    }

    fetch(`${url}login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
        .then(resp => resp.json())
        .then(({ msg, token }) => {
            if (msg) {
                return console.error(msg)
            }
            localStorage.setItem('token', token)
            window.location = 'chat.html'
        })
        .catch(err => {
            console.log(err)
        });
})

function onSignIn(googleUser) {

    var id_token = googleUser.credential;

    const data = { id_token };

    fetch(`${url}google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(resp => resp.json())
        .then(({ token }) => {
            localStorage.setItem('token', token)
            window.location = 'chat.html'
        })
        .catch(err => {
            console.log(err)
        });

}

function signOut() {
    console.log('Usuario desconectado')
    google.accounts.id.disableAutoSelect();

    google.accounts.id.revoke(localStorage.getItem('token'), done => {
        localStorage.clear()
        location.reload()
    })
}