import express from 'express'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(express.static('public'))

app.put('/api', (req, res) => {
    res.status(200)
    res.send({msg: "oi"})
    res.end()
    console.log(req.body)
})

app.listen(3000, () => {
    console.log('ligado')
})