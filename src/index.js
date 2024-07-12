import express from 'express'
import cors from 'cors'
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import login from './routes/login.js'
import account from './routes/account.js'
import img from './routes/img.js'
import gallery from './routes/gallery.js'
import social from './routes/social.js'
import chat from './routes/chat.js'
import notify from './routes/notify.js'

export const userdb = new Low(new JSONFile('./src/database/userdb.json'))
await userdb.read(); userdb.data ||= []; await userdb.write()

const app = express()

app.use(cors())
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ limit: '1mb' }));
app.use(express.static('public'))
app.use("/images", express.static('src/database/images'))

app.use('/api/login', login)
app.use('/api/account', account)
app.use('/api/img', img)
app.use('/api/gallery', gallery)
app.use('/api/social', social)
app.use('/api/chat', chat)
app.use('/api/notify', notify)

app.listen(3000, () => {
    console.log('ligado')
})

Object.assign(Array.prototype, {
    shuffle() {
        let newArr = [...this]
        for (let i = newArr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArr[i], newArr[j]] = [newArr[j], newArr[i]]
        }
        return newArr
    }
})