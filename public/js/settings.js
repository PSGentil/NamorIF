import util from './util.js'

let userInfos = {
    username: localStorage.getItem('username'),
    email: localStorage.getItem('email'),
    showme: localStorage.getItem('showme'),
    sexuality: localStorage.getItem('sexuality'),
    gender: localStorage.getItem('gender')
}

for (const key in userInfos) {
    const label = document.querySelector(`label[for=new${key}]`)

    if (key == 'showme') {
        switch (userInfos[key]) {
            case 'homem':
                label.innerText += 'Homem'
                break;
            case 'mulher':
                label.innerText += 'Mulher'
                break;
            case 'todos':
                label.innerText += 'Todos'
                break;
        }
    } else if (key == 'gender') { if (userInfos[key] == 'nonbinarie') label.innerText += 'Não Binário'; else label.innerText += userInfos[key].cap() }
    else label.innerText += userInfos[key]
}

for (let i = 0; i < document.querySelectorAll('div.userInfoBox').length - 1; i++) {
    const userInfo = document.querySelectorAll('div.userInfoBox');
    userInfo[i].addEventListener('click', e => {
        document.querySelector('button').style.display = ''
        document.querySelector('img').style.display = ''
        for (let index = 0; index < userInfo.length; index++) {
            if (userInfo[index] != userInfo[i])
                userInfo[index].style.display = 'none'
        }
        for (let index = 0; index < userInfo[i].children.length; index++) {
            userInfo[i].children[index].style.display = 'block'
        }
    })
}

document.querySelector('img').addEventListener('click', e => {
    const userInfo = document.querySelectorAll('div.userInfoBox')
    const input = document.querySelectorAll('input')
    document.querySelector('button').style.display = 'none'
    document.querySelector('img').style.display = 'none'
    document.querySelector('select').style.display = 'none'
    for (let i = 0; i < input.length; i++) {
        input[i].value = ''
        input[i].style.display = 'none'
    }
    for (let i = 0; i < document.querySelectorAll('label[name=procurar], label[name=gender]').length; i++) {
        document.querySelectorAll('label[name=procurar], label[name=gender]')[i].style.display = 'none'
    }
    for (let i = 0; i < userInfo.length; i++) {
        userInfo[i].style.display = 'block'
    }
})

document.querySelector('button').addEventListener('click', async e => {
    let dadosEnviados = {
        email: userInfos.email,
        pass: localStorage.getItem('pass')
    }
    for (const key in userInfos) {
        if (document.querySelector(`input.new${key}, select.new${key}`))
            if (document.querySelector(`input.new${key}, select.new${key}`).value != '') {
                dadosEnviados[(key == 'email' ? 'newEmail' : key)] = document.querySelector(`input.new${key}, select.new${key}`).value
            }
    }
    for (const item of document.querySelectorAll('input[name="procurar"]')) {
        if (item.checked) {
            dadosEnviados['showme'] = item.value
        }
    }
    for (const item of document.querySelectorAll('input[name="gender"]')) {
        if (item.checked) {
            dadosEnviados['gender'] = item.value
        }
    }

    console.log(dadosEnviados)
    let camposValidados = util.checarCampos(dadosEnviados)

    if (camposValidados == true) {
        await fetch('/api/account/edit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' },
            body: JSON.stringify(dadosEnviados)
        }).then(async res => {
            if (res.status == 202) {
                util.save(await res.json())
                localStorage.setItem('isLogged', true)
                window.location.reload()
            } else if (res.status == 409) {
                util.errorMessage('email ou username já existem')
            } else {
                window.location.reload()
                localStorage.clear()
            }
        })
    } else {
        util.errorMessage(camposValidados)
    }
})

document.querySelector('#deleteAccount').addEventListener('click', e => {

    e.preventDefault()

    if (!document.querySelector('body #confirmDeleteAccount')) {
        const settings = document.getElementById('settingsPageAccountInfo')
        const confirmDeleteAccount = document.createElement('div')
        confirmDeleteAccount.id = 'confirmDeleteAccount'
        confirmDeleteAccount.className = 'popup'
        settings.appendChild(confirmDeleteAccount)

        const confirmDeleteAccountTitle = document.createElement('p')
        confirmDeleteAccountTitle.innerText = 'Deseja realmente excluir sua conta?'
        confirmDeleteAccount.appendChild(confirmDeleteAccountTitle)

        const yesButton = document.createElement('button')
        yesButton.name = 'yes'
        yesButton.addEventListener('click', deleteAccount)
        yesButton.innerText = 'Sim'
        confirmDeleteAccount.appendChild(yesButton)

        const noButton = document.createElement('button')
        noButton.name = 'no'
        noButton.innerText = 'Não'
        confirmDeleteAccount.appendChild(noButton)
        noButton.addEventListener('click', e => {
            const display = document.getElementById('confirmDeleteAccount').style.display
            document.getElementById('confirmDeleteAccount').style.display = (display == 'none' ? 'flex' : 'none')
        })
    } else {
        const display = document.getElementById('confirmDeleteAccount').style.display
        document.getElementById('confirmDeleteAccount').style.display = (display == 'none' ? 'flex' : 'none')
    }

    function deleteAccount() {
        fetch('/api/account', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' },
            body: JSON.stringify({
                email: userInfos.email,
                pass: localStorage.getItem('pass')
            })
        }).then(() => {
            localStorage.clear()
            window.open('../', '_self')
        })
    }
})
