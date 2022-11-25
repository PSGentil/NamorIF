let email = window.localStorage.getItem('email')
let pass = window.localStorage.getItem('pass')

if (email) {
    enviarLogin('', email, pass).then(res => {
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
export function criarConta(username, email, pass, profilePhoto) {
    return fetch('/api/login/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        body: JSON.stringify({
            username: username,
            email: email,
            pass: pass,
            profilePhoto: profilePhoto
        })
    })
}