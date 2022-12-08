import { Router } from 'express'
import { db } from '../index.js'

export default Router().post('/love', async (req, res) => {
    const serverUser = db.data.registeredUsers.find(u => u.email == req.body.email && u.pass == req.body.pass)
    const lovedUser = db.data.registeredUsers.find(u => u.id == req.body.id)

    if (!lovedUser) {
        res.status(404).send()
    } else if (serverUser != -1) {
        if (!serverUser.love.find(u => u == lovedUser.id)) {
            serverUser.love.push(lovedUser.id)
            await db.write()
            res.status(200).send()
        } else {
            res.status(202).send(lovedUser.id)
        }
    } else res.status(401).send()
}).post('/deny', async (req, res) => {
    const serverUser = db.data.registeredUsers.find(u => u.email == req.body.email && u.pass == req.body.pass)
    const deniedUser = db.data.registeredUsers.find(u => u.id == req.body.id)

    if (!deniedUser) {
        res.status(404).send()
    } else if (serverUser != -1) {
        if (!serverUser.deny.find(u => u == deniedUser.id)) serverUser.deny.push(deniedUser.id)
        await db.write()
        res.status(202).send()
    } else res.status(401).send()
}).get('/profile/:id', (req, res) => {
    const user = db.data.registeredUsers.find(u => u.id == req.params.id)
    if (user) {
        const nextUser = db.data.registeredUsers.find(u => checkCompatibility(user, u) && u.id != req.params.id)

        if (nextUser) return res.status(200).send({ ...nextUser, email: null, pass: null })
    }
    res.status(404).send(null)
})

function checkCompatibility(source, target) {
    if (source.love.find(u => target.id == u) || source.deny.find(u => target.id == u)) return false
    if ([target.showme, 'nonbinarie'].includes(source.gender) && [source.showme, 'nonbinarie'].includes(target.gender)) return true
    else if (['todos', target.gender].includes(source.showme) && ['todos', source.gender].includes(target.showme)) return true
    else return false
}