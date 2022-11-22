let email = window.localStorage.getItem('email')
let password = window.localStorage.getItem('password')

if (email) {
    enviarLogin(email, password).then(res => {
        if (res.status == 202) {
            window.localStorage.setItem('isLogged', true)
        } else {
            window.localStorage.setItem('isLogged', '')
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