import { Router } from 'express'
import { db } from '../index.js'

export default Router().post('/', async (req, res) => {
    let serverUser
    if (req.body.email) {
        serverUser = db.data.registeredUsers.find(u => u.email == req.body.email)
    } else {
        serverUser = db.data.registeredUsers.find(u => u.username == req.body.username)
    }

    if (serverUser) {
        if (serverUser.pass == req.body.pass) res.status(202).send(serverUser) // accepted
        else res.status(401).send() // not authorized
    } else res.status(404).send() // not found

}).post('/create', async (req, res) => {
    db.data.registeredUsers.push(req.body)
    await db.write()
    res.status(202).send()
})