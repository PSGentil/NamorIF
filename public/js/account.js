import util from './util.js'

let photo = await util.getImg(localStorage.getItem('profilePhoto'))

document.getElementsByTagName('title')[0].innerText = localStorage.getItem('username')
document.getElementById('profilePhoto').src = photo

//painel genero
for (const p of document.querySelectorAll('#painelGenero p')) {
    p.innerText = (localStorage.getItem(p.id) == 'nonbinarie' ? 'Não binário' : localStorage.getItem(p.id).cap())
}

const campos = {
    name: localStorage.getItem('name'),
    lastname: localStorage.getItem('lastname'),
    username: localStorage.getItem('username'),
    birthdate: localStorage.getItem('birthdate')
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
            await fetch(`/api/img/${localStorage.getItem('profilePhoto')}`, { method: 'DELETE' })

            photo = await util.uploadImg(await util.cropImage(reader.result), document.querySelector('#uploadProgress'))

            await fetch('/api/account/edit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json; charset=UTF-8' },
                body: JSON.stringify({
                    email: localStorage.getItem('email'),
                    pass: localStorage.getItem('pass'),
                    profilePhoto: photo
                })
            }).then(async res => {
                if (res.status == 202) {
                    util.save(await res.json())
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

        let validate = util.checarCampos({ [key]: document.querySelector(`#${key} input`).value.trim() })

        if (validate == true) {
            await fetch('/api/account/edit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json; charset=UTF-8' },
                body: JSON.stringify({
                    email: localStorage.getItem('email'),
                    pass: localStorage.getItem('pass'),
                    [key]: document.querySelector(`#${key} input`).value.trim()
                })
            }).then(async res => {
                if (res.status == 202) {
                    util.save(await res.json())
                }
            })
            window.location.reload()
        } else {
            util.errorMessage(validate)
        }
    })
}

//bio
document.querySelector(`#bio p`).innerText = localStorage.getItem('bio') ?? 'Biografia (edite este valor padrão)'

document.querySelector(`#bio img.editIcon`).addEventListener('click', e => {
    let display = document.querySelector(`#bio textarea`).style.display
    const bio = localStorage.getItem('bio')

    document.querySelector('#bio textarea').innerHTML = bio
    document.querySelector(`#bio p`).innerText = bio

    document.querySelector(`#bio textarea`).style.display = (display == 'inline' ? 'none' : 'inline')
    document.querySelector('#bio p').style.display = (display != 'inline' ? 'none' : 'inline')
    document.querySelector(`#bio img.saveIcon`).style.display = (display == 'inline' ? 'none' : 'inline')
})

document.querySelector(`#bio img.saveIcon`).addEventListener('click', async e => {
    let validate = util.checarCampos({ bio: document.querySelector(`#bio textarea`).value.trim() })

    if (validate == true) {
        await fetch('/api/account/edit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' },
            body: JSON.stringify({
                email: localStorage.getItem('email'),
                pass: localStorage.getItem('pass'),
                bio: document.querySelector(`#bio textarea`).value.trim()
            })
        }).then(async res => {
            if (res.status == 202) {
                util.save(await res.json())
            }
        })
        window.location.reload()
    } else {
        util.errorMessage(validate)
    }
})

//  ------------------------------ gallery ------------------------------------------------------

//display
const galleryImgs = document.querySelectorAll('#gallery figure img')
const photos = localStorage.getItem('photos').indexOf(',') != -1 ? localStorage.getItem('photos').split(',') : [localStorage.getItem('photos')]
for (let i = 0; i < galleryImgs.length; i++) {
    if (photos[i]) {
        galleryImgs[i].src = await util.getImg(photos[i])
    }
}
//input setup
const galleryInputs = document.querySelectorAll('#gallery input')
for (const input of galleryInputs) {
    input.addEventListener('change', () => {
        const reader = new FileReader()
        reader.readAsDataURL(input.files[0])
        reader.addEventListener('load', async () => {
            photo = await util.uploadImg(await util.cropImage(reader.result), document.querySelector('#progress-bar-gallery'))
            await fetch('/api/gallery/edit', {
                method: 'POST',
                headers: { "Content-Type": "application/json; charset=UTF-8" },
                body: JSON.stringify({
                    email: localStorage.getItem('email'),
                    pass: localStorage.getItem('pass'),
                    photos: {
                        [Number(input.id.replace('gallery-image-', '')) - 1]: photo
                    }
                })
            }).then(async res => {
                if (res.ok) {
                    let body = await res.json()
                    util.save(body)
                    window.location.reload()
                }
            })
        })
    })
}

//delete buttons
const clearButtons = document.querySelectorAll('.clear-gallery-image')
for (let i = 0; i < clearButtons.length; i++) {

    clearButtons[i].addEventListener('click', async e => {
        e.preventDefault()
        if (photos[i]) {
            await fetch('/api/gallery', {
                method: 'DELETE',
                headers: { "Content-Type": "application/json; charset=UTF-8" },
                body: JSON.stringify({
                    email: localStorage.getItem('email'),
                    pass: localStorage.getItem('pass'),
                    photos: {
                        [i]: photos[i]
                    }
                })
            }).then(async res => {
                if (res.ok) {
                    let body = await res.json()
                    util.save(body)
                    window.location.reload()
                }
            })
        }
    })
}