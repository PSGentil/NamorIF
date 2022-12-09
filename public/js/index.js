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
    await findProfile()
}

for (const botao of document.querySelectorAll('img.botao')) {
    botao.addEventListener('click', e => {
        profile.className = 'next'
        setTimeout(() => { profile.className = '' }, 2000)
    })
    botao.addEventListener('click', findProfile)
}

document.querySelector('img#love').addEventListener('click', e => {
    fetch(`/api/social/love`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        body: JSON.stringify({
            // User
            email: localStorage.getItem('email'),
            pass: localStorage.getItem('pass'),
            // Loved person
            id: atualProfile
        })
    })
    findProfile()
})

document.querySelector('img#deny').addEventListener('click', e => {
    fetch(`/api/social/deny`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        body: JSON.stringify({
            // User
            email: localStorage.getItem('email'),
            pass: localStorage.getItem('pass'),
            // Denied person
            id: atualProfile
        })
    })
    findProfile()
})

async function findProfile() {
    fetch(`/api/social/profile/${localStorage.getItem('id')}`, { method: 'GET' }).then(async res => {
        if (res.ok) {
            let body = await res.json()
            atualProfile = body.id
            displayProfile(body)
        } else {
            displayProfile(null)
        }
    })
}

async function displayProfile(atual) {
    if (atual) {
        img.src = await util.getImg(atual.profilePhoto)
        nome.innerText = `${atual.name} ${atual.lastname}`
        desc.innerText = atual.bio ?? ''
        sexualidade.innerText = atual.sexuality
    } else {
        img.src = '../images/notfound.png'
        nome.innerText = 'Não foi possível encontrar outro perfil'
        desc.innerText = 'Não foi possível encontrar alguém que seja compatível com você no momento.'
        sexualidade.innerText = ''
        document.querySelector('#options').style.display = 'none'
    }
}