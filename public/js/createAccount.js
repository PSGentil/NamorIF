import util from './util.js'

let etapasCriarConta = document.getElementsByTagName('form')
let etapaAtualCriarConta = 0

let profilePhoto
const inputImg = document.getElementById('profileImg')
inputImg.addEventListener("change", () => {
    const reader = new FileReader()
    reader.readAsDataURL(inputImg.files[0])
    reader.addEventListener('load', async () => {
        inputImg.style.display = 'none'
        document.querySelector('#cadastroEtapa3 div').innerText = 'Carregando imagem...'
        profilePhoto = await util.uploadImg(await util.cropImage(reader.result))
        document.querySelector('#cadastroEtapa3 div').innerText = 'Imagem Carregada!'
        inputImg.style.display = 'block'
    })
})

let inputMostrar
let inputEuSou
document.getElementById('createAccountButton').addEventListener('click', async e => {
    e.preventDefault()

    let inputNome = document.getElementById('nome').value.trim()
    let inputSobrenome = document.getElementById('sobrenome').value.trim()
    let inputEmail = document.getElementById('email').value.trim()
    let inputSenha = document.getElementById('senha').value.trim()
    let inputUsername = document.getElementById('username').value.trim()
    let inputSenhaConfirmar = document.getElementById('confirmarSenha').value.trim()
    let inputSexualidade = document.getElementById('opcaoSexual').value.trim()
    let inputDataNascimento = document.getElementById('dataNascimento').value.trim()

    let camposPrimeiraPagina = {
        name: inputNome,
        lastname: inputSobrenome,
        username: inputUsername,
        email: inputEmail,
        pass: inputSenha,
        passConfirm: inputSenhaConfirmar,
        birthdate: inputDataNascimento
    }

    let camposSegundaPagina = {
        sexualidade: inputSexualidade,
        mostrar: false,
        eusou: false
    }

    let verificarPreenchido

    switch (etapaAtualCriarConta) {
        case 0:
            verificarPreenchido = util.checarCampos(camposPrimeiraPagina)            
            break
        case 1:
            for (const item of document.querySelectorAll('input[name="procurar"], input[name="eusou"]')) {
                if (item.checked) {
                    switch(item.className){
                        case 'procura':
                            camposSegundaPagina.mostrar = item.value
                            inputMostrar = item.value
                            break
                        case 'gender':
                            camposSegundaPagina.eusou = item.value
                            inputEuSou = item.value
                            break
                        default:
                            window.alert(item.className)
                            break
                    }
                }
            }
            verificarPreenchido = util.checarCampos(camposSegundaPagina)
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
                gender: inputEuSou,
                profilePhoto: profilePhoto
            })
        } else {
            etapaAtualCriarConta++
            document.querySelector('header img').style.display = 'block'
            util.atualizarEtapaCadastro(etapasCriarConta, etapaAtualCriarConta)
        }
    } else {
        util.errorMessage(verificarPreenchido)
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