import util from './util.js'

//só exemplo, muda aí

const profilePhoto = await util.getImg(window.localStorage.getItem('profilePhoto'))

//como colocar a image em img
document.getElementById('profilePhotoImg').src = profilePhoto
//como colocar a image em div
document.getElementById('profilePhotoDiv').style.backgroundImage = `url(${profilePhoto})`