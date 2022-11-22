import { Router } from 'express'
import { db } from '../index.js'

export default Router().get('/', async (req, res) => {
    const serverUser = db.data.registeredUsers.find(u => u.email == req.body.email && u.pass == req.body.pass)

    if (serverUser) {
        res.status(202).send(serverUser)
    } else {
        res.status(401).send()
    }
})