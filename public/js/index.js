// Index Buttons Functions
import login from '../../src/routes/login.js'
import { enviarLogin, criarConta } from './login.js'

let menuActive, logPageOn

document.getElementById('menu').addEventListener('click', e => {
    let navBar = document.getElementsByTagName('nav')
    let icons = document.getElementsByClassName('icons')

    if (!menuActive) {
        navBar[0].style.width = '25%'
        for (const icon of icons) {
            icon.style.margin = '0 0 0 5%'
            //icon.style.transition = '.3s
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

function logPageSwitch(e) {
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
}

document.getElementById('loginIcon').addEventListener('click', logPageSwitch)
document.getElementById('closeLogin').addEventListener('click', logPageSwitch)

document.getElementById('loginAccount').addEventListener('click', e => {
    let title = document.getElementById('titleLogPage')
    let email = document.getElementById('getEmail')
    let senha = document.getElementById('getPass')
    let logButton = document.getElementById('logButton')
    let switchLog = document.getElementById('switchLogCreate')
    let switchLogClick = document.getElementById('loginAccount')

    if (document.getElementById('loginAccount').method == 'login') {
        title.innerText = 'Criar Conta'
        switchLog.innerText = 'Já tem uma conta? '
        email.style.display = 'none'
        senha.style.display = 'none'
        logButton.style.display = 'none'

        document.getElementById('loginAccount').method = 'createAccount'
    } else {
        title.innerText = 'Log in NamorIF'
        switchLog.innerText = 'Ainda não tem uma conta? '
        logButton.innerText = 'Log in'
        logButton.style.display = "none"
        emailCreate.style.display = "none"
        switchLogClick.style.display = 'inline'
        logButton.style.display = 'inline'
        email.style.display = 'block'
        senha.style.display = 'block'


        

        document.getElementById('loginAccount').method = 'login'
    }
})
 
document.getElementById('logButton').addEventListener('click', e => {
    e.preventDefault()
    let email = document.getElementById('getEmail').value
    let password = document.getElementById('getPass').value
    let passConfirm = document.getElementById('getPassConfirm').value

    if (document.getElementById('loginAccount').method == 'login') {
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
        if (password == passConfirm) {
            criarConta(email, password).then(res => {
                if (res.status == 202) {
                    window.localStorage.setItem('email', email)
                    window.localStorage.setItem('password', password)
                    window.localStorage.setItem('isLogged', true)

                    document.getElementById('logPage').style.display = 'none'
                    logPageOn = false
                    window.location.href = '../pages/account.html'
                }
            })
        } else {
            window.alert("MUDA")
        }
    }
})