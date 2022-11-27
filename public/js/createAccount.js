import util from './util.js'

let etapasCriarConta = document.getElementsByTagName('form')
let etapaAtualCriarConta = 0

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

    let inputNome = document.getElementById('nome').value
    let inputSobrenome = document.getElementById('sobrenome').value
    let inputEmail = document.getElementById('email').value
    let inputSenha = document.getElementById('senha').value
    let inputUsername = document.getElementById('username').value
    let inputSenhaConfirmar = document.getElementById('confirmarSenha').value
    let inputSexualidade = document.getElementById('opcaoSexual').value
    let inputDataNascimento = document.getElementById('dataNascimento').value
    let inputMostrar

    let camposPrimeiraPagina = {
        nome: inputNome,
        sobrenome: inputSobrenome,
        username: inputUsername,
        email: inputEmail,
        senha: inputSenha,
        birthdate: Date.parse(inputDataNascimento)
    }

    let camposSegundaPagina = {
        sexualidade: inputSexualidade,
        mostrar: false
    }

    let verificarPreenchido

    switch (etapaAtualCriarConta){
        case 0:
            verificarPreenchido = util.checarCamposVazios(camposPrimeiraPagina)
            if (inputSenha != inputSenhaConfirmar)
                verificarPreenchido = 'senhasDiferentes'
            break
        case 1:
            for (const item of document.querySelectorAll('input[name="procurar"]')) {
                if (item.checked){ 
                    camposSegundaPagina.mostrar = item.value
                    inputMostrar = item.value
                }
            }
            verificarPreenchido = util.checarCamposVazios(camposSegundaPagina)
            break
        case 2:
            if (!profilePhoto) verificarPreenchido = 'imagem'
            else verificarPreenchido = true
            break
    }

    if (verificarPreenchido == true) {
        if (etapaAtualCriarConta == etapasCriarConta.length - 1) {
            await util.criarConta({
                name: inputNome,
                lastname: inputSobrenome,
                username: inputUsername,
                email: inputEmail,
                pass: inputSenha,
                birthdate: inputDataNascimento,
                sexuality: inputSexualidade,
                showme: inputMostrar,
                profilePhoto: profilePhoto
            })
        } else {
            etapaAtualCriarConta++
            document.querySelector('header img').style.display = 'block'
            util.atualizarEtapaCadastro(etapasCriarConta, etapaAtualCriarConta)
        }
    } else {
        window.alert(`ta faltando ${verificarPreenchido}`)
    }
})

document.querySelector('header img').addEventListener('click', e => {
    if (etapaAtualCriarConta == 1) {
        document.querySelector('header img').style.display = 'none'
    }

    if (etapaAtualCriarConta > 0) {
        etapaAtualCriarConta--
        util.atualizarEtapaCadastro(etapasCriarConta, etapaAtualCriarConta)
    }
})

document.querySelector('header p').addEventListener('click', e => {
    etapaAtualCriarConta++
    util.atualizarEtapaCadastro(etapasCriarConta, etapaAtualCriarConta)
})