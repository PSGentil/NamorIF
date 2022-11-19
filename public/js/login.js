let email = window.localStorage.getItem('email')
let password = window.localStorage.getItem('password')

if (email) {
    enviarLogin(email, password).then(async res => {
        let body = await res.json()

        if (body.isLogged) {

        }
    })
}

export function enviarLogin(email, pass) {
    return fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        body: JSON.stringify({
            email: email,
            pass: pass
        })
    })
}