import util from './util.js'

let email = window.localStorage.getItem('email')
let pass = window.localStorage.getItem('pass')

if (email) {
    util.enviarLogin(email, pass).then(async res => {
        if (res.status == 202) {
            let body = await res.json()
            for (const key in body) {
                window.localStorage.setItem(key, body[key])
            }
            window.localStorage.setItem('isLogged', true)
        } else {
            window.localStorage.clear()
            window.location.reload()
        }
    })
}