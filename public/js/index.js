import util from './util.js'

let img = document.querySelector('#foto img')
let nome = document.getElementById('nome')
let desc = document.getElementById('descricao')
let profile = document.getElementById('nextProfile')

if (!window.localStorage.getItem('isLogged')){
    displayProfile(null)
} 
else await findProfile() 

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
            email: window.localStorage.getItem('email'),
            pass: window.localStorage.getItem('pass'),
            // Loved person
            id: window.localStorage.getItem('atualProfile')
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
            email: window.localStorage.getItem('email'),
            pass: window.localStorage.getItem('pass'),
            // Denied person
            id: window.localStorage.getItem('atualProfile')
        })
    })
    findProfile()
})

async function findProfile() {
    fetch(`/api/social/profile/${window.localStorage.getItem('id')}`, { method: 'GET' }).then(async res => {
        if (res.ok) {
            let atualProfile = await res.json()
            window.localStorage.setItem('atualProfile', atualProfile.id)
            displayProfile(atualProfile)
        } else {
            displayProfile(null)
        }
    })
}

async function displayProfile(atual) {

    if (atual) {
        img.src = await util.getImg(atual.profilePhoto)
        nome.innerText = `${atual.name} ${atual.lastname}`
        if (atual.bio) desc.innerText = atual.bio
        else desc.innerText = ''
    } else {
        img.src = '../images/notfound.png'
        nome.innerText = 'Não foi possível encontrar outro perfil'
        desc.innerText = 'Não foi possível encontrar alguém que seja compatível com você no momento.'
        document.querySelector('#legenda').style.display = 'none'
    }

}