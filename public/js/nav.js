// Index Buttons Functions
import util from './util.js'
import settings from './settings.js'

let logPageOn, loginAccountMethod

const nav = document.createElement('nav')
document.querySelector('main').appendChild(nav)
const bottomIcons = document.createElement('div')
bottomIcons.id = 'bottomIcons'
nav.appendChild(bottomIcons)

/**
 * @type {[string]: HTMLElement}
 */
const icons = {
    loginIcon: document.createElement('img'),
    homeIcon: document.createElement('img'),
    bottom: {
        logoutIcon: document.createElement('img'),
        settingsIcon: document.createElement('img')
    }
}

for (const key in icons) {
    if (key == 'bottom') {
        for (const keyb in icons['bottom']) {
            icons['bottom'][keyb].id = keyb
            icons['bottom'][keyb].src = `../images/${keyb}.png`
            icons['bottom'][keyb].title = keyb.replace('Icon', '')
            bottomIcons.appendChild(icons['bottom'][keyb])
        }
    } else {
        icons[key].id = key
        icons[key].src = `../images/${key}.png`
        icons[key].title = key.replace('Icon', '')
        nav.appendChild(icons[key])
    }
}

if (localStorage.getItem('profilePhoto') != null) {
    const userPhoto = await util.getImg(window.localStorage.getItem('profilePhoto'))
    document.getElementById('loginIcon').src = userPhoto
}

document.getElementById('emailCreate').addEventListener('click', e => {
    e.preventDefault()
    logPageSwitch()
    window.open('../pages/createAccount.html', '_blank')
})

function logPageSwitch(e) {
    let isLogged = window.localStorage.getItem('isLogged')

    if (!isLogged || e.target.id == 'closeLogin') {
        let logPage = document.getElementById('logPage')

        if (!logPageOn) {
            logPage.style.display = 'block'
            logPageOn = true
        } else {
            logPage.style.display = 'none'
            logPageOn = false
        }
    } else if (e.target.id == 'loginIcon') {
        window.open('../pages/account.html', '_self')
    }
}

icons['loginIcon'].addEventListener('click', logPageSwitch)
document.getElementById('closeLogin').addEventListener('click', logPageSwitch)

document.getElementById('loginAccount').addEventListener('click', e => {
    let title = document.getElementById('titleLogPage')
    let email = document.getElementById('getEmail')
    let senha = document.getElementById('getPass')
    let logButton = document.getElementById('logButton')
    let switchLog = document.getElementById('switchLogCreate')
    let switchLogClick = document.getElementById('loginAccount')

    if (loginAccountMethod == 'login') {
        title.innerText = 'Criar Conta'
        switchLog.innerText = 'Já tem uma conta? '
        switchLogClick.innerText = 'Clique aqui para logar.'
        emailCreate.style.display = 'inline'
        email.style.display = 'none'
        senha.style.display = 'none'
        logButton.style.display = 'none'

        loginAccountMethod = 'createAccount'
    } else {
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
        util.enviarLogin(email, password).then(async res => {
            if (res.status == 202) {
                let body = await res.json()
                for (const key in body) {
                    window.localStorage.setItem(key, body[key])
                }
                window.localStorage.setItem('isLogged', true)

                document.getElementById('logPage').style.display = 'none'
                logPageOn = false
                window.location.reload()
            } else {
                window.alert("senha incorreta")
                window.localStorage.setItem('isLogged', '')
            }
        })
    }
})

icons.bottom['logoutIcon'].addEventListener('click', e => {
    window.localStorage.clear()
    if (window.location.href != '../index.html') window.open('../index.html', '_self')
    else window.location.reload()
})

icons.bottom['settingsIcon'].addEventListener('click', e => {
    let settingsPopup = document.getElementById('settingsPopup')

    if (settingsPopup.style.display == 'none') settingsPopup.style.display = 'block'
    else settingsPopup.style.display = 'none'
})

document.getElementById('accountSettings').addEventListener('click', e => {
    let switchPopup = settings.accountConfigPopup
    switchPopup()

    document.getElementById('settingsPopup').style.display = 'none'
    document.getElementById('closeAccountSettings').onclick = switchPopup
})

icons['homeIcon'].addEventListener('click', e => {
    window.open('../index.html', '_self')
})