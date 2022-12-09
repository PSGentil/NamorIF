import express from 'express'
import cors from 'cors'
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import login from './routes/login.js'
import account from './routes/account.js'
import img from './routes/img.js'
import social from './routes/social.js'
import chat from './routes/chat.js'

export const userdb = new Low(new JSONFile('./src/database/userdb.json'))
await userdb.read(); userdb.data ||= []; await userdb.write()

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('public'))

app.use('/api/login', login)
app.use('/api/account', account)
app.use('/api/img', img)
app.use('/api/social', social)
app.use('/api/chat', chat)

app.listen(3000, () => {
    console.log('ligado')
})