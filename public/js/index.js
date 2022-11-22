// Index Buttons Functions
import { enviarLogin } from './login.js'

let menuActive, logPageOn

document.getElementById('menu').addEventListener('click', e => {
    let navBar = document.getElementsByTagName('nav')
    let icons = document.getElementsByClassName('icons')

    if (!menuActive) {
        navBar[0].style.width = '25%'
        for (const icon of icons) {
            icon.style.margin = '0 0 0 5%'
            //icon.style.transition = '.3s'
        }
        menuActive = true
    } else {
        navBar[0].style.width = '5%'
        for (const icon of icons) {
            icon.style.margin = '0 0 0 20%'
        }
        menuActive = false
    }
})

document.getElementById('loginIcon').addEventListener('click', e => {
    let isLogged = window.localStorage.getItem('isLogged')

    if (!isLogged) {
        let logPage = document.getElementById('logPage')

        if (!logPageOn) {
            logPage.style.display = 'block'
            logPageOn = true
        } else {
            logPage.style.display = 'none'
            logPageOn = false
        }
    } else {
        window.location.href = '../pages/account.html'
    }
})

document.getElementById('loginButton').addEventListener('click', e => {
    let email = document.getElementById('getEmail').value
    let password = document.getElementById('getPass').value
    let passConfirm = document.getElementById('getPassConfirm').value

    if (password == passConfirm) {
        enviarLogin(email, password).then(res => {
            if (res.status == 202) {
                window.localStorage.setItem('email', email)
                window.localStorage.setItem('password', password)
                window.localStorage.setItem('isLogged', true)

                document.getElementById('logPage').style.display = 'none'
                logPageOn = false
                window.location.href = '../pages/account.html'
            } else {
                window.alert("senha incorreta")
                window.localStorage.setItem('isLogged', '')
            }
        })
    } else {
        window.alert("MUDA")
    }
})