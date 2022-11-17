import { Router } from 'express'

export const login = Router()
    .post('/', (req, res) => {
        console.log(req.body)
    })