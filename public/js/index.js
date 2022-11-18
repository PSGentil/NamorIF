// Index Buttons Functions
import{ enviarLogin } from './login.js'


let menuActive, logPageOn = false

function expand() {

    let navBar = document.getElementsByTagName('nav')
    let icons = document.getElementsByClassName('icons')

    if (!menuActive) {
        navBar[0].style.width = '50%'
        icons[0].style.margin = '0 0 0 90%'
        icons[1].style.margin = '0 0 0 90%'
        menuActive = true
    } else {
        navBar[0].style.width = '5%'
        icons[0].style.margin = '0 auto'
        icons[1].style.margin = '0 auto'
        menuActive = false
    }

}

function logPage() {

    let logPage = document.getElementById('logPage')

    if (!logPageOn) {
        logPage.style.display = 'block'
        logPageOn = true
    } else {
        logPage.style.display = 'none'
        logPageOn = false
    }

}

function login() {

    let email = document.getElementById('getEmail')
    let pass =  document.getElementById('getPass')
    let passConfirm =  document.getElementById('getPassConfirm')

    if(pass == passConfirm){
        enviarLogin(email, pass).then(res => {
            
        })
    }else{
        window.alert("MUDA")
    }

}