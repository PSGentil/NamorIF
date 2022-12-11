import { Router } from 'express'
import { userdb } from '../index.js'
import { createChannel } from './chat.js'

export default Router().post('/love', async (req, res) => {
    const serverUser = userdb.data.find(u => u.email == req.body.email && u.pass == req.body.pass)
    const lovedUser = userdb.data.find(u => u.id == req.body.id)

    if (!lovedUser) {
        res.status(404).send()
    } else if (serverUser) {
        if (!serverUser.love.find(u => u == lovedUser.id)) {
            serverUser.love.push(lovedUser.id)

            if (!lovedUser.love.find(u => u == serverUser.id)) {
                res.status(200).send()
            } else {
                serverUser.friends.push(lovedUser.id)
                lovedUser.friends.push(serverUser.id)
                await createChannel(serverUser.id, lovedUser.id)
                res.status(202).send('match')
            }
            await userdb.write()
        }
    } else res.status(401).send()
}).post('/deny', async (req, res) => {
    const serverUser = userdb.data.find(u => u.email == req.body.email && u.pass == req.body.pass)
    const deniedUser = userdb.data.find(u => u.id == req.body.id)

    if (!deniedUser) {
        res.status(404).send()
    } else if (serverUser != -1) {
        if (!serverUser.deny.find(u => u == deniedUser.id)) serverUser.deny.push(deniedUser.id)
        await userdb.write()
        res.status(202).send()
    } else res.status(401).send()
}).get('/profile/:id', (req, res) => {
    const user = userdb.data.find(u => u.id == req.params.id)
    if (user) {
        const nextUser = userdb.data.find(u => checkCompatibility(user, u) && u.id != req.params.id)

        if (nextUser) return res.status(200).send({
            id: nextUser.id,
            name: nextUser.name,
            lastname: nextUser.lastname,
            bio: nextUser.bio,
            sexuality: nextUser.sexuality,
            profilePhoto: nextUser.profilePhoto
        })
    }
    res.status(404).send(null)
}).post('/friends', (req, res) => {
    const user = userdb.data.find(u => u.email == req.body.email && u.pass == req.body.pass)
    if (user) {
        const friends = []
        for (const id of user.friends) {
            const friend = userdb.data.find(u => u.id == id)
            if (friend) friends.push({
                id: friend.id, name: friend.name, lastname: friend.lastname, bio: friend.bio, profilePhoto: friend.profilePhoto
            })
        }

        if (friends.length) return res.status(200).send({ friends })
    }
    res.status(404).send()
})

function checkCompatibility(source, target) {
    if (source.love.find(u => target.id == u) || source.deny.find(u => target.id == u)) return false
    if (source.showme == 'todos' && source.gender == 'nonbinarie') return true
    if (target.showme == 'todos' && target.gender == 'nonbinarie') return true
    if ([target.showme, 'nonbinarie'].includes(source.gender) && [source.showme, 'nonbinarie'].includes(target.gender)) return true
    if (['todos', target.gender].includes(source.showme) && ['todos', source.gender].includes(target.showme)) return true
    return false
}