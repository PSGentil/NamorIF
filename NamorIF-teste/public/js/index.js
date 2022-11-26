// Index Buttons Functions
import util from './util.js'

let menuActive, logPageOn, loginAccountMethod

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
            logPage.style.height = '15em'
            logPage.style.transition = '.3s'
            
            logPageOn = true
        } else {
            logPage.style.display = 'none'
            logPageOn = false
        }
    } else if (e.target.id == 'loginIcon') {
        window.open('../pages/account.html', '_blank')
    }
}

document.getElementById('loginIcon').addEventListener('click', logPageSwitch)
document.getElementById('closeLogin').addEventListener('click', logPageSwitch)

document.getElementById('loginAccount').addEventListener('click', e => {
    let logPage = document.getElementById('logPage')
    let title = document.getElementById('titleLogPage')
    let email = document.getElementById('getEmail')
    let senha = document.getElementById('getPass')
    let logButton = document.getElementById('logButton')
    let switchLog = document.getElementById('switchLogCreate')
    let switchLogClick = document.getElementById('loginAccount')

    if (loginAccountMethod == 'login') {
        logPage.style.height = '15em'
        title.innerText = 'Criar Conta'
        switchLog.innerText = 'Já tem uma conta? '
        switchLogClick.innerText = 'Clique aqui para logar.'
        emailCreate.style.display = 'inline'
        email.style.display = 'none'
        senha.style.display = 'none'
        logButton.style.display = 'none'

        loginAccountMethod = 'createAccount'
    } else {
        logPage.style.height = '80%'
        title.innerText = 'Log in NamorIF'
        switchLog.innerText = 'Ainda não tem uma conta? '
        switchLogClick.innerText = 'Clique aqui para criar uma conta.'
        logButton.innerText = 'Log in'
        logButton.style.display = "none"
        emailCreate.style.display = "none"
        switchLogClick.style.display = 'inline'
        logButton.style.display = 'inline'
        email.style.display = 'block'
        senha.style.display = 'block'

        loginAccountMethod = 'login'
    }
})

document.getElementById('logButton').addEventListener('click', e => {
    e.preventDefault()
    let email = document.getElementById('getEmail').value
    let password = document.getElementById('getPass').value

    if (loginAccountMethod == 'login') {
        if (email.includes('@')) {
            util.enviarLogin('', email, password).then(async res => {
                if (res.status == 202) {
                    let body = await res.json()
                    for (const key in body) {
                        window.localStorage.setItem(key, body[key])
                    }
                    window.localStorage.setItem('isLogged', true)

                    document.getElementById('logPage').style.display = 'none'
                    logPageOn = false
                    window.open('../pages/account.html', '_blank')
                } else {
                    window.alert("senha incorreta")
                    window.localStorage.setItem('isLogged', '')
                }
            })
        } else {
            util.enviarLogin(email, '', password).then(async res => {
                if (res.status == 202) {
                    let body = await res.json()
                    for (const key in body) {
                        window.localStorage.setItem(key, body[key])
                    }
                    window.localStorage.setItem('isLogged', true)

                    document.getElementById('logPage').style.display = 'none'
                    logPageOn = false
                    window.open('../pages/account.html', '_blank')
                } else {
                    window.alert("senha incorreta")
                    window.localStorage.setItem('isLogged', '')
                }
            })
        }
    }
})