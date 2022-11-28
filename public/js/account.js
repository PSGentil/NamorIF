import util from './util.js'

let name = localStorage.getItem('name')
let lastname = localStorage.getItem('lastname')
let username = localStorage.getItem('username')
let birthdate = localStorage.getItem('birthdate')

let userPhoto = await util.getImg(window.localStorage.getItem('profilePhoto'))
let mostrarNome =  document.getElementById('nomeUsuario')
let mostrarSobrenome = document.getElementById('sobrenomeUsuario')
let mostrarUsername = document.getElementById('username')
let mostrarDataNascimento = document.getElementById('dataNascimento')


let campos = {
    name: name,
    lastname: lastname,
    username: username,
    birthdate: birthdate,
    profilepic: userPhoto
}

if (util.checarCamposVazios(campos) == true){
    document.getElementsByTagName('title')[0].innerText = localStorage.getItem('username')
    document.getElementById('fotoPerfil').src = userPhoto
    mostrarNome.innerText = localStorage.getItem('name')
    mostrarSobrenome.innerText = localStorage.getItem('lastname')
    mostrarUsername.innerText = localStorage.getItem('username')
    mostrarDataNascimento.innerText = localStorage.getItem('birthdate')
}

export default class account{

}