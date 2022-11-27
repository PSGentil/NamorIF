import { Router } from 'express'
import { db } from '../index.js'

export default Router().post('/', async (req, res) => {
    if (req.body.pass) {
        const serverUser = db.data.registeredUsers.find(u => u.username == req.body.username)

        if (serverUser) {
            if (serverUser.pass == req.body.pass) res.status(202).send(serverUser) // accepted
            else res.status(401).send() // not authorized
        } else res.status(404).send() // not found
    } else {
        const serverUser = db.data.registeredUsers.find(u => u.username == req.body.username)

        if (serverUser) {
            res.status(200).send()
        } else res.status(404).send()
    }
}).post('/validate', async (req, res) => {
    if (db.data.registeredUsers.find(u => u.email == req.body.email && u.username == req.body.username)) {
        res.status(200).send('email&username')
    } else if (db.data.registeredUsers.find(u => u.email == req.body.email)) {
        res.status(200).send('email')
    } else if (db.data.registeredUsers.find(u => u.username == req.body.username)) {
        res.status(200).send('username')
    } else {
        res.status(404).send()
    }
}).post('/edit', async (req, res) => {
    const serverUser = db.data.registeredUsers.find(u => u.email == req.body.email && u.pass == req.body.pass)

    if (serverUser) {
        for (const key in req.body) {
            serverUser[key] = req.body[key]
        }

        await db.write()
        res.status(202).send(serverUser)
    } else {
        res.status(401).send()
    }
})