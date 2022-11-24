import { Router } from "express"
import { Low } from "lowdb"
import { JSONFile } from "lowdb/node"
import { v4 } from 'uuid'

export const imgdb = new Low(new JSONFile("./db.json"))
await imgdb.read(); imgdb.data ||= []; await imgdb.write()

export default Router().post('/:id', async (req, res) => {
	switch (req.body.status) {
		case 'start':
			let imgId = v4()

			imgdb.push({
				imgId: imgId,
				string: '',
				status: 'sending'
			})

			await imgdb.write()
			res.status(200).send({ imgId: imgId })
			break
		case 'sending':
			if (req.params.id) {
				let img = imgdb.data.find(i => i.imgId == req.params.id)

				img.string += req.body.string

				res.status(202)
			} else {
				res.status(400)
			}
			break
		case 'end':
			imgdb.data.find(i => i.imgId == req.params.id).status = 'end'
			await imgdb.write()
			break
	}
}).get('/:id', async (req, res) => {
	let img = imgdb.data.find(i => i.imgId == req.params.id)
	res.status(200).send()
})