import express from 'express'
import cors from 'cors'

const app = express()

app.use(cors())

app.post('/', (req, res) => {
    res.end()
})

app.listen(3000, () => {
    console.log('ligado')
})