import util from './util.js'

const removeFriend = document.querySelector('button#block')
const confirms = document.querySelectorAll('button.confirm')
const certeza = document.querySelector('div#block p')
const visitInfos = JSON.parse(localStorage.getItem('visitAccount'))

removeFriend.addEventListener('click', () => {
    removeFriend.style.display = (!removeFriend.style.display || removeFriend.style.display == 'block' ? 'none' : 'block')

    if (certeza.style.display == 'none') certeza.style.display = 'block'
    else certeza.style.display = 'none'

    for (const butt of confirms) {
        butt.style.display = (removeFriend.style.display == 'none' ? 'inline-block' : 'none')
    }
})

for (const butt of confirms) {
    if (butt.id == 'yes') butt.addEventListener('click', () => {
        fetch(`/api/social/friends/${visitInfos['id']}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' },
            body: JSON.stringify({
                email: localStorage.getItem('email'),
                pass: localStorage.getItem('pass')
            })
        }).then(res => {
            if (res.ok) window.open('../index.html', '_self')
        })
    })
    else butt.addEventListener('click', () => removeFriend.click())
}

document.querySelector('title').innerText = visitInfos['username']
for (const key in visitInfos) {
    switch (key) {
        case 'id': break
        case 'gender':
            document.querySelector(`p#${key}`).innerText += (visitInfos[key] == 'nonbinarie' ? 'Não binário' : visitInfos[key].cap())
            break
        case 'sexuality':
            document.querySelector(`p#${key}`).innerText += visitInfos[key]
            break
        case 'bio':
            document.querySelector(`#bio p`).innerText = visitInfos[key]
            break
        case 'profilePhoto':
            document.querySelector(`#${key}`).src = await util.getImg(visitInfos[key])
            break
        default:
            document.querySelector(`#${key} h1`).innerText = visitInfos[key]
            break
    }
}