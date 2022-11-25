import { getImg } from './img.js'

//só exemplo, muda aí

const profilePhoto = await getImg(window.localStorage.getItem('profilePhoto'))

//como colocar a image em img
document.getElementById('profilePhotoImg').src = profilePhoto
//como colocar a image em div
document.getElementById('profilePhotoDiv').style.backgroundImage = `url(${profilePhoto})`

/**
 * @param {string} username 
 * @returns {Object} server data of user
 */
 export async function getAccount(username) {
    return await (await fetch('/api/account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        body: JSON.stringify({
            username: username
        })
    })).json()
}