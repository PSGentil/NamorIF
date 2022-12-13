import { Router } from 'express'
import { userdb } from '../index.js'
import { imgdb } from './img.js'
import fs from 'fs'

export default Router().post('/edit', async (req, res) => {
    const user = userdb.data.find(u => u.email == req.body.email && u.pass == req.body.pass)

    if (user) {
        if (!user.photos) user.photos = []

        for (let key in req.body.photos) {
            key = Number(key)

            if (user.photos[key]) {
                const img = imgdb.data.findIndex(i => i.id == user.photos[key])

                if (img != -1) {
                    fs.unlinkSync(imgdb.data[img].path)
                    imgdb.data.splice(img, 1)
                    await imgdb.write()
                }
            }

            user.photos[key] = req.body.photos[key]
        }

        await userdb.write()
        res.status(200).send(user)
    } else res.status(401).send()
}).delete('/', async (req, res) => {
    const user = userdb.data.find(u => u.email == req.body.email && u.pass == req.body.pass)

    if (user) {
        if (!user.photos) user.photos = []

        for (let key in req.body.photos) {
            key = Number(key)

            if (user.photos[key]) {
                const img = imgdb.data.findIndex(i => i.id == user.photos[key])

                if (img != -1) {
                    fs.unlinkSync(imgdb.data[img].path)
                    imgdb.data.splice(img, 1)
                    await imgdb.write()
                }
            }

            user.photos[key] = null
        }

        await userdb.write()
        res.status(200).send(user)
    } else res.status(401).send()
})