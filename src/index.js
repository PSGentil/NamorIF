import express from 'express'
import cors from 'cors'
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import login from './routes/login.js'
import account from './routes/account.js'
import uploadImg from './routes/uploadImg.js'

export const db = new Low(new JSONFile('./db.json'))
await db.read(); db.data ||= { registeredUsers: [] }; await db.write()

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('public'))

app.use('/api/login', login)
app.use('/api/account', account)
app.use('/api/uploadImg', uploadImg)

app.listen(3000, () => {
    console.log('ligado')
})