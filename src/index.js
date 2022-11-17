import express from 'express'
import cors from 'cors'
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import { login } from './routes/Login.js'

const db = new Low(new JSONFile('./db.json'))
await db.read(); db.data ||= {}

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('public'))

app.use('/api/login', login)

app.listen(3000, () => {
    console.log('ligado')
})