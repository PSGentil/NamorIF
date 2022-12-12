import { Router } from 'express'
import { userdb } from '../index.js'
import { v4 } from 'uuid'

export default Router().post('/', async (req, res) => {
    let serverUser
    if (req.body.email) {
        serverUser = userdb.data.find(u => u.email == req.body.email)
    } else {
        serverUser = userdb.data.find(u => u.username == req.body.username)
    }

    if (serverUser) {
        if (serverUser.pass == req.body.pass) res.status(202).send(serverUser) // accepted
        else res.status(401).send() // not authorized
    } else res.status(404).send() // not found

}).post('/create', async (req, res) => {
    userdb.data.push({ id: v4(), ...req.body, love: [], deny: [], friends: [], photos: [] })
    await userdb.write()
    res.status(202).send()
})