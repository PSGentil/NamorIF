const link = document.createElement('link')
link.href = '../css/nav.css'
link.type = 'text/css'
link.rel = 'stylesheet'
document.querySelector('head').appendChild(link)

const loginCSS = document.createElement('link')
loginCSS.href = '../css/login.css'
loginCSS.type = 'text/css'
loginCSS.rel = 'stylesheet'
document.querySelector('head').appendChild(loginCSS)

const nav = document.createElement('nav')
document.querySelector('main').appendChild(nav)

const bottomIcons = document.createElement('div')
bottomIcons.id = 'bottomIcons'
nav.appendChild(bottomIcons)

const settingsPopup = document.createElement('div')
settingsPopup.id = 'settingsPopup'
settingsPopup.className = 'popup'
settingsPopup.style.display = 'none'
bottomIcons.appendChild(settingsPopup)

const accountSettings = document.createElement('div')
accountSettings.id = 'accountSettings'
accountSettings.innerText = 'Configurações de Conta'
settingsPopup.appendChild(accountSettings)

const credits = document.createElement('div')
credits.id = 'credits'
credits.innerText = 'Créditos'
credits.addEventListener('click', e => {
    window.open('../pages/credits.html', '_self')
})
settingsPopup.appendChild(credits)

const logout = document.createElement('div')
logout.id = 'logout'
logout.innerText = 'Sair'
settingsPopup.appendChild(logout)

/**
 * @type {[string]: HTMLElement}
 */
const icons = {
    loginIcon: document.createElement('img'),
    homeIcon: document.createElement('img'),
    chatIcon: document.createElement('img'),
    bottom: {
        settingsIcon: document.createElement('img')
    }
}

for (const key in icons) {
    if (key == 'bottom') {
        for (const keyb in icons['bottom']) {
            icons['bottom'][keyb].id = keyb
            icons['bottom'][keyb].src = `../images/${keyb}.png`
            icons['bottom'][keyb].title = keyb.replace('Icon', '')
            if (keyb == 'settingsIcon') icons['bottom'][keyb].className = 'openPopup'
            bottomIcons.appendChild(icons['bottom'][keyb])
        }
    } else {
        icons[key].id = key
        icons[key].src = `../images/${key}.png`
        icons[key].title = key.replace('Icon', '')
        if (key == 'loginIcon') icons[key].className = 'openPopup'
        nav.appendChild(icons[key])
    }
}

//popuplogin
const logPage = document.createElement('div')
logPage.id = 'logPage'
logPage.className = 'popup'
document.querySelector('main').appendChild(logPage)

const header = document.createElement('header')
logPage.appendChild(header)

const h1 = document.createElement('h1')
h1.innerText = 'Criar Conta'
header.appendChild(h1)

const closeLogin = document.createElement('img')
closeLogin.id = 'closeLogin'
closeLogin.className = 'close'
closeLogin.src = '../images/close.png'
header.appendChild(closeLogin)

const form = document.createElement('form')
logPage.appendChild(form)

const div1 = document.createElement('div')
form.appendChild(div1)

const getEmail = document.createElement('input')
getEmail.type = 'text'
getEmail.id = 'getEmail'
getEmail.placeholder = 'Nome de Usuário ou Email'

const getPass = document.createElement('input')
getPass.type = 'password'
getPass.id = 'getPass'
getPass.min = 8
getPass.placeholder = 'Senha'

div1.append(getEmail, getPass)

const div2 = document.createElement('div')
form.appendChild(div2)

const logButton = document.createElement('button')
logButton.id = 'logButton'
logButton.innerText = 'Criar Conta'

const emailCreate = document.createElement('button')
emailCreate.id = 'emailCreate'
emailCreate.innerText = 'Criar conta com email'

div2.append(logButton, emailCreate)

const footer = document.createElement('footer')
form.appendChild(footer)

const switchLogCreate = document.createElement('span')
switchLogCreate.id = 'switchLogCreate'
switchLogCreate.innerText = 'Já tem uma conta? '
footer.appendChild(switchLogCreate)

const loginAccount = document.createElement('span')
loginAccount.id = 'loginAccount'
loginAccount.innerText = 'Clique aqui para logar.'
footer.appendChild(loginAccount)