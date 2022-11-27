import util from './util.js'

let username = localStorage.getItem('username')

if (username != null) document.getElementsByTagName('title')[0].innerText = localStorage.getItem('username')

//só exemplo, muda aí

const profilePhoto = await util.getImg(window.localStorage.getItem('profilePhoto'))

//como colocar a image em img
document.getElementById('profilePhotoImg').src = profilePhoto