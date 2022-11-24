let email = window.localStorage.getItem('email')
let password = window.localStorage.getItem('password')

if (email) {
    enviarLogin('', email, password).then(res => {
        if (res.status == 202) {
            window.localStorage.setItem('isLogged', true)
        } else {
            window.localStorage.setItem('isLogged', '')
        }
    })
}

/**
 * @param {string} email 
 * @param {string} pass 
 */
export function enviarLogin(username, email, pass) {
    return fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        body: JSON.stringify({
            username: username,
            email: email,
            pass: pass
        })
    })
}

/**
 * @param {string} email 
 * @param {string} pass 
 */
export function criarConta(email, pass, username) {
    return fetch('/api/login/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        body: JSON.stringify({
            username: username,
            email: email,
            pass: pass
        })
    })
}

export async function getAccount(username) {
    return (await fetch('/api/account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        body: JSON.stringify({
            username: username
        })
    }))
}