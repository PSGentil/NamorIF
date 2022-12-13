import util from "./util.js"

let friends, atualChat, pause = true, sendDelay = Date.now()
const users = { [localStorage.getItem('id')]: { name: localStorage.getItem('name') } }

await fetch(`/api/social/friends`, {
    method: 'POST',
    headers: { "Content-Type": "application/json; charset=UTF-8" },
    body: JSON.stringify({
        email: localStorage.getItem('email'),
        pass: localStorage.getItem('pass')
    })
}).then(async res => {
    if (res.ok) {
        ({ friends } = await res.json())

        for (let i = 0; i < friends.length; i++) {
            users[friends[i].id] = friends[i]

            const friendBox = document.createElement('div')
            friendBox.id = `friend-${i + 1}`
            friendBox.className = friends[i].id
            document.querySelector('#matchs').appendChild(friendBox)
            friendBox.addEventListener('click', openChat)

            const friendPhoto = document.createElement('img')
            friendPhoto.src = await util.getImg(friends[i].profilePhoto)
            friendBox.appendChild(friendPhoto)

            const friendName = document.createElement('p')
            friendName.innerText = `${friends[i].name} ${friends[i].lastname}`
            friendBox.appendChild(friendName)

            const notify = document.createElement('img')
            notify.classList.add('notify')
            notify.src = '../images/notify.png'
            friendBox.appendChild(notify)

            for (let index = 0; index < friendBox.children.length; index++) {
                friendBox.children[index].addEventListener('click', openChat)
                friendBox.children[index].classList.add(friends[i].id)
            }
        }
    } else {
        const noFriends = document.querySelectorAll('.noFriends')
        for (const nf of noFriends) {
            nf.style.display = 'block'
        }
    }
})

document.querySelector('#profile img').addEventListener('click', () => {
    if (atualChat) {
        localStorage.setItem('visitAccount', JSON.stringify(users[atualChat]))
        window.open('../pages/visitAccount.html', '_blank')
    }
})

//loading principal
document.querySelector('main').style.display = 'block'
document.querySelector('#principal.lds-heart').style.display = 'none'

document.querySelector('button').addEventListener('click', async () => {
    if (Date.now() - sendDelay > 800 && pause) {
        sendDelay = Date.now()
        pause = false
        if (document.querySelector('input').value) {
            await fetch(`/api/chat/message/${atualChat}`, {
                method: 'POST',
                headers: { "Content-Type": "application/json; charset=UTF-8" },
                body: JSON.stringify({
                    email: localStorage.getItem('email'),
                    pass: localStorage.getItem('pass'),
                    content: document.querySelector('input').value
                })
            }).then(async res => {
                if (res.ok) {
                    document.querySelector('input').value = ''
                }
            })
        }
    }
})

document.addEventListener('keydown', e => {
    if (e.key == 'Enter' && Date.now() - sendDelay > 800) document.querySelector('button').click()
})

let sleep, count, openDelay = Date.now()
/**
 * @param {MouseEvent} e 
 */
async function openChat(e) {
    if (Date.now() - openDelay > 250) {
        atualChat = e.target.className
        for (const icon of document.querySelectorAll(`.notify`)) {
            if (icon.classList.contains(atualChat)) {
                icon.style.display = 'none'
                fetch(`/api/notify/${atualChat}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
                    body: JSON.stringify({
                        email: localStorage.getItem('email'),
                        pass: localStorage.getItem('pass')
                    })
                })
            }
        }
        sleep = false

        document.querySelector('#mensagens').style.display = 'none'
        document.querySelector('#sendMessage').style.display = 'none'
        document.querySelector('#profile').style.display = 'none'
        //loading chat
        document.querySelector('#chat.lds-heart').style.display = 'block'
        await initialMessages()
        document.querySelector('#chat.lds-heart').style.display = 'none'

        document.querySelector('#profile img').src = await util.getImg(users[atualChat].profilePhoto)
        document.querySelector('#profile p').innerText = `${users[atualChat].name} ${users[atualChat].lastname}`
        document.querySelector('#sendMessage').style.display = 'block'
        document.querySelector('#profile').style.display = 'flex'

        document.querySelector('#mensagens').style.display = 'flex'
        updateScrollBar()

        sleep = true
        count = 0
        updateMessages()
    }
}
setTimeout(() => document.querySelector('#matchs div').click(), 300)

function displayChannel(channel) {
    const messagesDiv = document.querySelector('#mensagens')
    if (channel.messages) {
        while (messagesDiv.firstChild) {
            messagesDiv.removeChild(messagesDiv.lastChild)
        }
        for (const msg in channel.messages) {
            const msgDiv = document.createElement('div')
            msgDiv.innerText = `${channel.messages[msg].content}`
            if (channel.messages[msg].owner == localStorage.getItem('id')) msgDiv.classList.add('owner')
            else msgDiv.classList.add('other')
            msgDiv.classList.add('msg')
            messagesDiv.appendChild(msgDiv)
        }
    } else {
        for (const msg of channel) {
            const msgDiv = document.createElement('div')
            msgDiv.innerText = `${msg.content}`
            if (msg.owner == localStorage.getItem('id')) msgDiv.classList.add('owner')
            else msgDiv.classList.add('other')
            msgDiv.classList.add('msg')
            messagesDiv.appendChild(msgDiv)
        }
    }
}

async function initialMessages() {
    let messages = {}, status = true

    for (let i = 0; status; i += 5) {
        await fetch(`/api/chat/channel/initial/${atualChat}/${i}`, {
            method: 'POST',
            headers: { "Content-Type": "application/json; charset=UTF-8" },
            body: JSON.stringify({
                email: localStorage.getItem('email'),
                pass: localStorage.getItem('pass')
            })
        }).then(async res => {
            if (res.ok) {
                const msgs = await res.json()
                for (const msg of msgs) {
                    messages[msg.id] = msg
                }
            } else status = false
        })
    }
    displayChannel({ messages })
}

function updateScrollBar() {
    const scroll = document.querySelector('#conversa')
    scroll.scrollTo({ top: scroll.scrollHeight })
}

async function updateMessages() {
    if (sleep) {
        const date = Date.now()
        await fetch(`/api/chat/channel/${atualChat}`, {
            method: 'POST',
            headers: { "Content-Type": "application/json; charset=UTF-8" },
            body: JSON.stringify({
                email: localStorage.getItem('email'),
                pass: localStorage.getItem('pass'),
                length: document.querySelector('#mensagens').childElementCount
            })
        }).then(async res => {
            if (res.status == 202) {
                displayChannel(await res.json())
                updateScrollBar()
                count++
                if (count > 7) document.querySelector(`div.${atualChat}`).click()
            } else count = 0
            pause = true
            if (Date.now() - date < 50) {
                setTimeout(updateMessages, 100)
            } else updateMessages()
        })
    }
}

//check notifications
async function checkNotifications() {
    for (const fr in users) {
        if (fr == localStorage.getItem('id')) continue
        await fetch(`/api/notify/${fr}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' },
            body: JSON.stringify({
                email: localStorage.getItem('email'),
                pass: localStorage.getItem('pass')
            })
        }).then(res => {
            if (res.status == 202 && atualChat != fr) {
                for (const icon of document.querySelectorAll(`.notify`)) {
                    if (icon.classList.contains(fr)) icon.style.display = 'inline'
                }
            }
        })
    }
    setTimeout(checkNotifications, 900)
}
checkNotifications()