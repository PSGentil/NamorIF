// Index Buttons Functions
import { enviarLogin } from './login.js'

let menuActive, logPageOn

const menu = document.getElementById('menu')
menu.onclick = () => {
    let navBar = document.getElementsByTagName('nav')
    let icons = document.getElementsByClassName('icons')

    if (!menuActive) {
        navBar[0].style.width = '50%'
        for (const icon of icons) {
            icon.style.margin = '0 0 0 90%'
        }
        menuActive = true
    } else {
        navBar[0].style.width = '5%'
        for (const icon of icons) {
            icon.style.margin = '0 auto'
        }
        menuActive = false
    }
}

const loginIcon = document.getElementById('loginIcon')
loginIcon.onclick = () => {
    let logPage = document.getElementById('logPage')

    if (!logPageOn) {
        logPage.style.display = 'block'
        logPageOn = true
    } else {
        logPage.style.display = 'none'
        logPageOn = false
    }
}

const loginButton = document.getElementById('loginButton')
loginButton.onclick = () => {
    let email = document.getElementById('getEmail').value
    let password = document.getElementById('getPass').value
    let passConfirm = document.getElementById('getPassConfirm').value

    if (password == passConfirm) {
        enviarLogin(email, password).then(async res => {
            let body = await res.json()

            if (body.isLogged) {
                window.localStorage.setItem('email', email)
                window.localStorage.setItem('password', password)
            } else {
                window.alert("senha incorreta")
            }
        })
    } else {
        window.alert("MUDA")
    }
}