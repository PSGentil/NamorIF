import util from './util.js'

let profilePhoto = await util.getImg(window.localStorage.getItem('profilePhoto'))

document.getElementsByTagName('title')[0].innerText = window.localStorage.getItem('username')
document.getElementById('fotoPerfil').src = profilePhoto

const campos = {
    name: window.localStorage.getItem('name'),
    lastname: window.localStorage.getItem('lastname'),
    username: window.localStorage.getItem('username'),
    birthdate: window.localStorage.getItem('birthdate')
}

//photo
document.querySelector(`#profileImage img.editIcon`).addEventListener('click', e => {
    e.preventDefault()
    const input = document.querySelector(`#profileImage input`)
    let display = input.style.display
    input.style.display = (!display ? 'block' : '')

    input.addEventListener("change", () => {
        const reader = new FileReader()
        reader.readAsDataURL(input.files[0])
        reader.addEventListener('load', async () => {
            await fetch(`/api/img/${window.localStorage.getItem('profilePhoto')}`, { method: 'DELETE' })

            profilePhoto = await util.uploadImg(await util.cropImage(reader.result))

            await fetch('/api/account/edit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json; charset=UTF-8' },
                body: JSON.stringify({
                    email: window.localStorage.getItem('email'),
                    pass: window.localStorage.getItem('pass'),
                    profilePhoto: profilePhoto
                })
            }).then(async res => {
                if (res.status == 202) {
                    let body = await res.json()
                    for (const key in body) {
                        window.localStorage.setItem(key, body[key])
                    }
                }
            })
            window.location.reload()
        })
    })
})

//others
for (const key in campos) {
    document.querySelector(`#${key} h1`).innerText = campos[key]

    document.querySelector(`#${key} img.editIcon`).addEventListener('click', e => {
        e.preventDefault()
        let display = document.querySelector(`#${key} input`).style.display

        document.querySelector(`#${key} input`).style.display = (!display ? 'block' : '')
        document.querySelector(`#${key} img.saveIcon`).style.display = (!display ? 'inline' : '')
    })

    document.querySelector(`#${key} img.saveIcon`).addEventListener('click', async e => {
        e.preventDefault()

        let validate = util.checarCampos({[key]: document.querySelector(`#${key} input`).value.trim()})

        if (validate == true) {
            await fetch('/api/account/edit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json; charset=UTF-8' },
                body: JSON.stringify({
                    email: window.localStorage.getItem('email'),
                    pass: window.localStorage.getItem('pass'),
                    [key]: document.querySelector(`#${key} input`).value.trim()
                })
            }).then(async res => {
                if (res.status == 202) {
                    let body = await res.json()
                    for (const key in body) {
                        window.localStorage.setItem(key, body[key])
                    }
                }
            })
            window.location.reload()
        } else {
            util.errorMessage(validate)
        }
    })
}

//bio
document.querySelector(`#bio p`).innerText = window.localStorage.getItem('bio') ?? 'Biografia (edite este valor padrão)'

document.querySelector(`#bio img.editIcon`).addEventListener('click', e => {
    let display = document.querySelector(`#bio textarea`).style.display
    const bio = window.localStorage.getItem('bio')

    document.querySelector('#bio textarea').innerText = bio
    document.querySelector(`#bio p`).innerText = bio

    document.querySelector(`#bio textarea`).style.display = (display == 'inline' ? 'none': 'inline')
    document.querySelector('#bio p').style.display = (display != 'inline'? 'none' : 'inline')
    document.querySelector(`#bio img.saveIcon`).style.display = (display == 'inline'? 'none' : 'inline')
})

document.querySelector(`#bio img.saveIcon`).addEventListener('click', async e => {
    let validate = util.checarCampos({bio: document.querySelector(`#bio textarea`).value.trim()})

    if (validate == true) {
        await fetch('/api/account/edit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' },
            body: JSON.stringify({
                email: window.localStorage.getItem('email'),
                pass: window.localStorage.getItem('pass'),
                bio: document.querySelector(`#bio textarea`).value.trim()
            })
        }).then(async res => {
            if (res.status == 202) {
                let body = await res.json()
                for (const key in body) {
                    window.localStorage.setItem(key, body[key])
                }
            }
        })
        window.location.reload()
    } else {
        util.errorMessage(validate)
    }
})