import util from './util.js'

let email = localStorage.getItem('email')
let pass = localStorage.getItem('pass')

if (email) {
    util.enviarLogin(email, pass).then(async res => {
        if (res.status == 202) {
            let body = await res.json()
            for (const key in body) {
                localStorage.setItem(key, body[key])
            }
            localStorage.setItem('isLogged', true)
        } else {
            localStorage.clear()
            window.location.reload()
        }
    })
}