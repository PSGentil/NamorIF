import { Router } from 'express'
import { userdb } from '../index.js'
import { chatdb } from './chat.js'

export default Router().post('/match', (req, res) => {
    const user = userdb.data.find(u => u.email == req.body.email && u.pass == req.body.pass)
    if (user) {
        const chats = chatdb.data.filter(ch => ch.users.includes(user.id) && ch.notifyMatch == true)
        if (chats.length) res.status(202).send()
        else res.status(200).send()
    } else res.status(401).send()
}).post('/:id', (req, res) => {
    const user = userdb.data.find(u => u.email == req.body.email && u.pass == req.body.pass)
    if (user) {
        const chat = chatdb.data.find(ch => ch.users.includes(user.id) && ch.users.includes(req.params.id) && ch.notify == true)

        if (chat) {
            if (Object.values(chat.messages).at(-1)) {
                if (Object.values(chat.messages).at(-1).owner == req.params.id) return res.status(202).send()
            }
        }
        res.status(200).send()
    } else res.status(401).send()
}).post('/', (req, res) => {
    const user = userdb.data.find(u => u.email == req.body.email && u.pass == req.body.pass)
    if (user) {
        const chats = chatdb.data.filter(ch => ch.users.includes(user.id) && ch.notify == true)
        let has

        if (chats.length) {
            for (const chat of chats) {
                const another = chat.users.find(u => u != user.id)
                if (Object.values(chat.messages).at(-1)) {
                    if (Object.values(chat.messages).at(-1).owner == another) has = true
                }
            }
        }

        if (has) res.status(202).send()
        else res.status(200).send()
    } else res.status(401).send()
}).delete('/match', async (req, res) => {
    const user = userdb.data.find(u => u.email == req.body.email && u.pass == req.body.pass)
    if (user) {
        const chats = chatdb.data.filter(ch => ch.users.includes(user.id) && ch.notifyMatch == true)
        if (chats.length) {
            for (const chat of chats) {
                chat.notifyMatch = false
            }
            await chatdb.write()
        }
        res.status(200).send()
    } else res.status(401).send()
}).delete('/:id', async (req, res) => {
    const user = userdb.data.find(u => u.email == req.body.email && u.pass == req.body.pass)
    if (user) {
        const chat = chatdb.data.find(ch => ch.users.includes(user.id) && ch.users.includes(req.params.id) && ch.notify == true)

        if (chat) {
            if (chat.notify) {
                chat.notify = false
                await chatdb.write()
            }
        }
        res.status(202).send()
    } else res.status(401).send()
})