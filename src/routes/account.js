import { Router } from 'express'
import { userdb } from '../index.js'
import { imgdb } from './img.js'

export default Router().get('/:id', (req, res) => {
    const user = userdb.data.find(u => u.id == req.params.id)
    if (user) res.status(200).send({ ...user, love: null, deny: null, email: null, pass: null })
    else res.status(404).send(null)
}).post('/validate', (req, res) => {
    if (userdb.data.find(u => u.email == req.body.email && u.username == req.body.username)) {
        res.status(200).send('email&username')
    } else if (userdb.data.find(u => u.email == req.body.email)) {
        res.status(200).send('email')
    } else if (userdb.data.find(u => u.username == req.body.username)) {
        res.status(200).send('username')
    } else {
        res.status(404).send()
    }
}).post('/edit', async (req, res) => {
    const serverUser = userdb.data.find(u => u.email == req.body.email && u.pass == req.body.pass)

    if (userdb.data.find(u => u.username == req.body.username) || userdb.data.find(u => u.email == req.body.newEmail)) {
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

        await userdb.write()
        res.status(202).send(serverUser)
    } else {
        res.status(401).send()
    }
}).delete('/', async (req, res) => {
    const serverUser = userdb.data.findIndex(u => u.email == req.body.email && u.pass == req.body.pass)

    if (serverUser != -1) {
        userdb.data.splice(serverUser, 1)

        const img = imgdb.data.findIndex(i => i.id == serverUser.profilePhoto)
        if (img != -1) {
            imgdb.data.splice(img, 1)
            await imgdb.write()
        }

        await userdb.write()
        res.status(202).send()
    } else res.status(401).send()
})