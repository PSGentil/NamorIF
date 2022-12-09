import { Router } from 'express'
import { Low } from "lowdb"
import { JSONFile } from "lowdb/node"
import { v4 } from 'uuid'
import { userdb } from '../index.js'

export const chatdb = new Low(new JSONFile("./src/database/chatdb.json"))
await chatdb.read(); chatdb.data ||= {}; await chatdb.write()

export default Router().post('/channel/:id', async (req, res) => {
    const serverUser = userdb.data.find(u => u.email == req.body.email && u.pass == req.body.pass)
    if (serverUser) {
        const channel = chatdb.data.find(ch => ch.users.includes(serverUser.id) && ch.users.includes(req.params.id))
        if (channel) {
            if (channel.messages.length == req.body.length) res.status(200).send()
            else res.status(202).send(channel)
        } else res.status(404).send()
    } else res.status(401).send()
}).post('/message/:id', async (req, res) => {
    const serverUser = userdb.data.find(u => u.email == req.body.email && u.pass == req.body.pass)
    if (serverUser) {
        const channel = chatdb.data.find(ch => ch.users.includes(serverUser.id) && ch.users.includes(req.params.id))
        if (channel) {
            channel.messages.push({
                id: v4(),
                content: req.body.content,
                owner: serverUser.id,
                date: Date.now()
            })
            res.status(200).send(channel)
            await chatdb.write()
        } else res.status(404).send()
    } else res.status(401).send()
})

export async function createChannel(...ids) {
    chatdb.data.push({
        users: ids,
        messages: []
    })
    await chatdb.write()
}