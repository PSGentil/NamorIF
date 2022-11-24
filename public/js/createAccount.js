import { criarConta } from './login.js'

document.getElementById('createAccountButton').addEventListener('click', async e => {

    e.preventDefault()

    let inputEmail = document.getElementById('email').value
    let inputSenha = document.getElementById('senha').value
    let inputUsername = document.getElementById('username').value
    let inputSenhaConfirmar = document.getElementById('confirmarSenha').value
    let inputImg = document.getElementById('profileImg')

    if (inputUsername != '' && inputEmail != '' && inputSenha != '' && inputImg.files.length != 0) {
        let resposta
        await fetch('/api/account/validate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' },
            body: JSON.stringify({
                email: inputEmail,
                username: inputUsername
            })
        }).then(async res => {
            if (res.ok) resposta = await res.text()
            else resposta = false
        })

        switch (resposta) {

            case false:

                if (inputSenha == inputSenhaConfirmar) {
                    criarConta(inputEmail, inputSenha, inputUsername).then(res => {
                        if (res.status == 202) {
                            window.localStorage.setItem('username', inputUsername)
                            window.localStorage.setItem('email', inputEmail)
                            window.localStorage.setItem('password', inputSenha)
                            window.localStorage.setItem('isLogged', true)

                            window.location.href = '../pages/account.html'
                        }
                    })
                } else {
                    window.alert("MUDA")
                }
                break

            case 'email':
                window.alert('email usado')
                break

            case 'username':
                window.alert('username usado')
                break

            case 'email&username':
                window.alert('email e username usados')
                break

        }
    }
})