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
                if (!lovedUser.friends.find(u => u.id == serverUser.id)) lovedUser.friends.push(serverUser.id)
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
        const nextUser = userdb.data.shuffle().find(u => checkCompatibility(user, u) && u.id != req.params.id)

        if (nextUser) return res.status(200).send({
            id: nextUser.id,
            name: nextUser.name,
            lastname: nextUser.lastname,
            username: nextUser.username,
            bio: nextUser.bio,
            sexuality: nextUser.sexuality,
            gender: nextUser.gender,
            birthdate: nextUser.birthdate,
            profilePhoto: nextUser.profilePhoto,
            photos: nextUser.photos
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
                id: friend.id,
                name: friend.name,
                lastname: friend.lastname,
                username: friend.username,
                bio: friend.bio,
                sexuality: friend.sexuality,
                gender: friend.gender,
                birthdate: friend.birthdate,
                profilePhoto: friend.profilePhoto,
                photos: friend.photos
            })
        }
        if (friends.length) res.status(200).send({ friends })
        else res.status(404).send()

    } else return res.status(401).send()
}).delete('/friends/:id', async (req, res) => {
    const user = userdb.data.find(u => u.email == req.body.email && u.pass == req.body.pass)
    if (user) {
        const friend = user.friends.findIndex(u => u == req.params.id)
        const friendUser = userdb.data.find(u => u.id == req.params.id)

        if (friend != -1) {
            user.friends.splice(friend, 1)
            user.love.splice(user.love.findIndex(u => u == req.params.id), 1)
            user.deny.push(req.params.id)

            if (friendUser) {
                friendUser.friends.splice(friendUser.friends.findIndex(u => u == user.id), 1)
                friendUser.love.splice(friendUser.love.findIndex(u => u == user.id), 1)
                friendUser.deny.push(user.id)
            }

            await userdb.write()
            res.status(200).send()
        }
        else res.status(404).send()
    } else return res.status(401).send()
})

function checkCompatibility(source, target) {
    if (source.love.find(u => target.id == u) || source.deny.find(u => target.id == u)) return false
    if (source.showme == 'todos' && source.gender == 'nonbinarie') return true
    if (target.showme == 'todos' && target.gender == 'nonbinarie') return true
    if ([target.showme, 'nonbinarie'].includes(source.gender) && [source.showme, 'nonbinarie'].includes(target.gender)) return true
    if (['todos', target.gender].includes(source.showme) && ['todos', source.gender].includes(target.showme)) return true
    return false
}