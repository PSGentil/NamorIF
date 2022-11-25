import util from './util.js'

let email = window.localStorage.getItem('email')
let pass = window.localStorage.getItem('pass')

if (email) {
    util.enviarLogin('', email, pass).then(res => {
        if (res.status == 202) {
            window.localStorage.setItem('isLogged', true)
        } else {
            window.localStorage.setItem('isLogged', '')
        }
    })
}