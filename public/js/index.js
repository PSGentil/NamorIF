import './conSpeed.js'
import util from './util.js'

let img = document.querySelector('img#profile')
let nome = document.querySelector('h1#nome')
let desc = document.querySelector('p#descricao')
let sexualidade = document.querySelector('p#sexualidade')
let profile = document.getElementById('nextProfile')
let atualProfile

if (!localStorage.getItem('isLogged')) {
    document.getElementById('noAccountSection').style.display = 'block'
    document.getElementById('nextProfile').style.display = 'none'
    displayProfile(null)
} else {
    document.getElementById('noAccountSection').style.display = 'none'
    document.getElementById('nextProfile').style.display = 'block'
    checkNotifications()
    await findProfile()
}

document.querySelector('button#criar').addEventListener('click', () => {
    document.querySelector('button#emailCreate').click()
    document.querySelector("div#logPage").style.display = 'none'
})

document.querySelector('button#logar').addEventListener('click', () => {
    document.querySelector('img#loginIcon').click()
    if (['none', ''].includes(document.querySelector('#getEmail').style.display)) {
        document.querySelector('span#loginAccount').click()
    }
})

document.querySelector('img#love').addEventListener('click', async e => {
    await fetch(`/api/social/love`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        body: JSON.stringify({
            // User
            email: localStorage.getItem('email'),
            pass: localStorage.getItem('pass'),
            // Loved person
            id: atualProfile.id
        })
    })
    profile.className = 'next'
    let next = true
    profile.addEventListener('animationend', () => {
        if (next) {
            profile.className = 'appear'
            next = false
        }
        else profile.className = ''
    })
    findProfile()
})

document.querySelector('img#deny').addEventListener('click', async e => {
    await fetch(`/api/social/deny`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        body: JSON.stringify({
            // User
            email: localStorage.getItem('email'),
            pass: localStorage.getItem('pass'),
            // Denied person
            id: atualProfile.id
        })
    })
    await findProfile()
})

async function findProfile() {
    await fetch(`/api/social/profile/${localStorage.getItem('id')}`, { method: 'GET' }).then(async res => {
        if (res.ok) {
            let body = await res.json()
            atualProfile = body
            displayProfile(body)
        } else {
            displayProfile(null)
        }
    })
}

async function displayProfile(atual) {
    if (atual != null) {
        img.src = await util.getImg(atual.profilePhoto)
        nome.innerText = `${atual.name} ${atual.lastname}`
        desc.innerText = atual.bio ?? ''
        sexualidade.innerText = atual.sexuality

        if (!atualProfile.photos) {
            document.querySelector('#next-icon').style.display = 'none'
            document.querySelector('#prev-icon').style.display = 'none'
        } else if (!atualProfile.photos.some(p => p != null)) {
            document.querySelector('#next-icon').style.display = 'none'
            document.querySelector('#prev-icon').style.display = 'none'
        } else {
            document.querySelector('#next-icon').style.display = 'block'
            document.querySelector('#prev-icon').style.display = 'block'
        }
    } else {
        img.src = '../images/notfound.png'
        nome.innerText = 'Não foi possível encontrar outro perfil'
        desc.innerText = 'Não foi possível encontrar alguém que seja compatível com você no momento.'
        sexualidade.innerText = ''
        document.querySelector('#options').style.display = 'none'
        profile.style.borderRadius = '0'

        document.querySelector('#next-icon').style.display = 'none'
        document.querySelector('#prev-icon').style.display = 'none'
    }
}

//carrossel
let photos = document.querySelectorAll('.galery')
let index = 0

document.querySelector('#next-icon').addEventListener('click', passar)
document.querySelector('#prev-icon').addEventListener('click', despassar)

async function passar() {
    photos[index].classList.remove('aparecer')
    photos[index].classList.add('sumir')
    if (index == photos.length - 1) index = -1
    photos[++index].classList.add('aparecer')
    photos[index].classList.remove('sumir')
    if (atualProfile.photos && index != 0) {
        if (atualProfile.photos[index - 1]) {
            if (!atualProfile.photos[index - 1].startsWith('/images/')) {
                atualProfile.photos[index - 1] = await util.getImg(atualProfile.photos[index - 1])
            }
            photos[index].src = atualProfile.photos[index - 1]
        } else passar()
    }
}

async function despassar() {
    photos[index].classList.remove('aparecer')
    photos[index].classList.add('sumir')
    if (index == 0) index = photos.length
    photos[--index].classList.add('aparecer')
    photos[index].classList.remove('sumir')
    if (atualProfile.photos && index != 0) {
        if (atualProfile.photos[index - 1]) {
            if (!atualProfile.photos[index - 1].startsWith('/images/')) {
                atualProfile.photos[index - 1] = await util.getImg(atualProfile.photos[index - 1])
            }
            photos[index].src = atualProfile.photos[index - 1]
        } else despassar()
    }
}

//check notifications
async function checkNotifications() {
    let changed
    //matchs
    await fetch('/api/notify/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        body: JSON.stringify({
            email: localStorage.getItem('email'),
            pass: localStorage.getItem('pass')
        })
    }).then(res => {
        if (res.status == 202) {
            document.querySelector('img#chatIcon').src = '../images/chatUnreadIcon.png'
            changed = true
        }
    })
    //messages notification
    await fetch(`/api/notify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        body: JSON.stringify({
            email: localStorage.getItem('email'),
            pass: localStorage.getItem('pass')
        })
    }).then(res => {
        if (res.status == 202) {
            document.querySelector('img#chatIcon').src = '../images/chatUnreadIcon.png'
            changed = true
        }
    })

    if (!changed) setTimeout(checkNotifications, 900)
}