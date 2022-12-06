import { Router } from 'express'
import { db } from '../index.js'
import { imgdb } from './img.js'

export default Router().post('/validate', (req, res) => {
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

    if (db.data.registeredUsers.find(u => u.username == req.body.username) || db.data.registeredUsers.find(u => u.email == req.body.newEmail)) {
        return res.status(409).send() //conflict
    }

    if (serverUser) {
        for (const key in req.body) {
            if (key == 'newEmail') {
                serverUser['email'] = req.body[key]

            } else if (key == 'profilePhoto') {
                let oldImg = imgdb.data.findIndex(i => i.id == serverUser.profilePhoto)
                if (oldImg != -1) {
                    imgdb.data.splice(oldImg, 1)
                    await imgdb.write()
                }
                serverUser[key] = req.body[key]

            } else serverUser[key] = req.body[key]
        }

        await db.write()
        res.status(202).send(serverUser)
    } else {
        res.status(401).send()
    }
}).delete('/', async (req, res) => {
    const serverUser = db.data.registeredUsers.findIndex(u => u.email == req.body.email && u.pass == req.body.pass)

    if (serverUser != -1) {
        db.data.registeredUsers.splice(serverUser, 1)

        const img = imgdb.data.findIndex(i => i.id == serverUser.profilePhoto)
        if (img != -1) {
            imgdb.data.splice(img, 1)
            await imgdb.write()
        }

        await db.write()
        res.status(202).send()
    } else {
        res.status(401).send()
    }
})