import util from './util.js'

let profilePhoto = await util.getImg(window.localStorage.getItem('profilePhoto'))

document.getElementsByTagName('title')[0].innerText = username
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
    })
}