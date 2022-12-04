import util from './util.js'
import './navInit.js'

let loginAccountMethod

function logPageSwitch(e) {
    let isLogged = window.localStorage.getItem('isLogged')

    if (!isLogged || e.target.id == 'closeLogin') {
        let display = document.getElementById('logPage').style.display
        document.getElementById('logPage').style.display = (display == '' || display == 'none' ? 'block' : 'none')
    } else if (e.target.id == 'loginIcon') {
        window.open('../pages/account.html', '_self')
    }
}

if (localStorage.getItem('profilePhoto') != null) {
    const userPhoto = await util.getImg(window.localStorage.getItem('profilePhoto'))
    document.getElementById('loginIcon').src = userPhoto
}

document.querySelector('#loginIcon').addEventListener('click', logPageSwitch)

document.body.addEventListener('click', e => {


    for (let i = 0; i < document.getElementsByClassName('popup').length; i++) {

        if ((e.target.className != 'popup' && e.target.className != 'openPopup') && !document.querySelector(`.popup ${e.target.tagName}`)) {
            document.getElementsByClassName('popup')[i].style.display = 'none'
        }
    }
})

document.querySelector('#homeIcon').addEventListener('click', e => {
    window.open('../index.html', '_self')
})

document.querySelector('#logout').addEventListener('click', e => {

    document.querySelector('#settingsPopup').style.display = 'none'

    e.preventDefault()

    if (!document.querySelector('body #confirmLogout')) {
        const confirmLogout = document.createElement('div')
        confirmLogout.id = 'confirmLogout'
        confirmLogout.className = 'popup'
        document.body.appendChild(confirmLogout)

        const confirmLogoutTitle = document.createElement('p')
        confirmLogoutTitle.innerText = 'Deseja realmente sair?'
        confirmLogout.appendChild(confirmLogoutTitle)

        const yesButton = document.createElement('button')
        yesButton.name = 'yes'
        yesButton.addEventListener('click', logout)
        yesButton.innerText = 'Sim'
        confirmLogout.appendChild(yesButton)

        const noButton = document.createElement('button')
        noButton.name = 'no'
        noButton.innerText = 'Não'
        confirmLogout.appendChild(noButton)
        noButton.addEventListener('click', e =>{
            const display = document.getElementById('confirmLogout').style.display
            document.getElementById('confirmLogout').style.display = (display == 'none' ? 'flex' : 'none')
        })
    } else {
        const display = document.getElementById('confirmLogout').style.display
        document.getElementById('confirmLogout').style.display = (display == 'none' ? 'flex' : 'none')
    }

    function logout() {

        window.localStorage.clear()
        if (window.location.href != '../index.html') window.open('../index.html', '_self')
        else window.location.reload()

    }

})

document.querySelector('#settingsIcon').addEventListener('click', e => {
    let settingsPopup = document.querySelector('#settingsPopup')
    if (settingsPopup.style.display == 'none') settingsPopup.style.display = 'block'
    else settingsPopup.style.display = 'none'
})

document.querySelector('#closeLogin').addEventListener('click', logPageSwitch)

document.getElementById('accountSettings').addEventListener('click', e => {
    if (window.localStorage.getItem('isLogged')) window.open('../pages/accountSettings.html', '_self')
    else window.open('#', '_self')
})

document.getElementById('emailCreate').addEventListener('click', e => {
    e.preventDefault()
    logPageSwitch()
    window.open('../pages/createAccount.html', '_self')
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

                window.location.reload()
                document.getElementById('logPage').style.display = 'none'
            } else {
                window.alert("senha incorreta")
                window.localStorage.setItem('isLogged', '')
            }
        })
    }
})

document.getElementById('loginAccount').addEventListener('click', e => {
    let title = document.querySelector('#logPage header h1')
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