import util from './util.js'

let userInfos = {
    username: window.localStorage.getItem('username'),
    email: window.localStorage.getItem('email'),
    showme: window.localStorage.getItem('showme'),
    sexuality: window.localStorage.getItem('sexuality')
}

for (const key in userInfos) {

    let label = document.querySelector(`label[for=new${key}]`)
    let input = document.querySelector(`input#new${key}`)

    if (key == 'showme') {
        switch (userInfos[key]) {
            case 'procuraHomem':
                label.innerText += 'Homem'
                break;
            case 'procuraMulher':
                label.innerText += 'Mulher'
                break;
            case 'procuraTodos':
                label.innerText += 'Todos'
                break;
        }
    } else label.innerText += userInfos[key]

    label.addEventListener('click', e => {

        let display = label.style.display

        label.style.display = (display == 'none' ? 'block' : 'none')
        input.style.display = (display == 'none' ? 'none' : 'block')


    })

}

document.querySelector('section button').addEventListener('click', async e => {

    let dadosEnviados = {

        email: userInfos.email,
        pass: localStorage.getItem('pass')

    }



    for (const key in userInfos) {

        if (document.getElementById(`new${key}`).value != '') {
            dadosEnviados[(key == 'email' ? 'newEmail' : key)] = document.getElementById(`new${key}`).value
        }
    }

    let camposValidados = util.checarCampos(dadosEnviados)

    if (camposValidados == true) {
        await fetch('/api/account/edit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' },
            body: JSON.stringify(dadosEnviados)
        }).then(async res => {
            if (res.status == 202) {
                let body = await res.json()
                for (const key in body) {
                    window.localStorage.setItem(key, body[key])
                }
                window.localStorage.setItem('isLogged', true)
                window.location.reload()
            } else if (res.status == 409) {
                util.errorMessage('email ou username já existem')
            } else {
                window.localStorage.clear()
                window.location.reload()
            }
        })
    } else {
        util.errorMessage(camposValidados)
    }
})
