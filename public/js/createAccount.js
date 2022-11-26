import util from './util.js'

let profilePhoto
const inputImg = document.getElementById('profileImg')
inputImg.addEventListener("change", () => {
    const reader = new FileReader()
    reader.readAsDataURL(inputImg.files[0])
    reader.addEventListener('load', async () => {
        profilePhoto = await util.uploadImg(reader.result)
    })
})

document.getElementById('createAccountButton').addEventListener('click', async e => {
    e.preventDefault()

    const inputEmail = document.getElementById('email').value
    const inputSenha = document.getElementById('senha').value
    const inputUsername = document.getElementById('username').value
    const inputSenhaConfirmar = document.getElementById('confirmarSenha').value

    if (inputUsername != '' && inputEmail != '' && inputSenha != '' && profilePhoto) {
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
                    util.criarConta(inputUsername, inputEmail, inputSenha, profilePhoto).then(res => {
                        if (res.ok) {
                            window.localStorage.setItem('username', inputUsername)
                            window.localStorage.setItem('email', inputEmail)
                            window.localStorage.setItem('pass', inputSenha)
                            window.localStorage.setItem('profilePhoto', profilePhoto)
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