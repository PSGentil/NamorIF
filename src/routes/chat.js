import { Router } from 'express'
import { Low } from "lowdb"
import { JSONFile } from "lowdb/node"
import { userdb } from '../index.js'

export const chatdb = new Low(new JSONFile("./src/database/chatdb.json"))
await chatdb.read(); chatdb.data ||= {}; await chatdb.write()

export default Router().post('/channel/initial/:id/:index', async (req, res) => {
    const user = userdb.data.find(u => u.email == req.body.email && u.pass == req.body.pass)
    if (user) {
        const channel = chatdb.data.find(ch => ch.users.includes(user.id) && ch.users.includes(req.params.id))
        if (channel) {
            const msgs = Object.values(channel.messages).slice(Number(req.params.index), Number(req.params.index) + 5)
            if (msgs.length) return res.status(200).send(msgs)
        }
        res.status(404).send()
    } else res.status(401).send()
}).post('/channel/:id', async (req, res) => {
    const user = userdb.data.find(u => u.email == req.body.email && u.pass == req.body.pass)
    if (user) {
        const channel = chatdb.data.find(ch => ch.users.includes(user.id) && ch.users.includes(req.params.id))
        if (channel) {
            const length = Object.keys(channel.messages).length
            if (length == req.body.length) res.status(200).send()
            else res.status(202).send(Object.values(channel.messages).slice(req.body.length, length))
        } else res.status(404).send()
    } else res.status(401).send()
}).post('/message/:id', async (req, res) => {
    const user = userdb.data.find(u => u.email == req.body.email && u.pass == req.body.pass)
    if (user) {
        const channel = chatdb.data.find(ch => ch.users.includes(user.id) && ch.users.includes(req.params.id))
        if (channel) {
            const id = Object.keys(channel.messages).length
            channel.messages[id] = {
                id: id,
                content: req.body.content,
                owner: user.id
            }
            res.status(200).send(channel.messages[id])
            channel.notify = true
            await chatdb.write()
        } else res.status(404).send()
    } else res.status(401).send()
})

export async function createChannel(...ids) {
    const channel = chatdb.data.find(ch => ch.users.includes(ids[0]) && ch.users.includes(ids[1]))

    if (!channel) {
        chatdb.data.push({
            users: ids,
            messages: {},
            notifyMatch: true,
            notify: false
        })
        await chatdb.write()
    }
}