import { Router } from "express"
import { Low } from "lowdb"
import { JSONFile } from "lowdb/node"
import { v4 } from 'uuid'

export const imgdb = new Low(new JSONFile("./db.json"))
await imgdb.read(); imgdb.data ||= []; await imgdb.write()

//reestruturar
export default Router().post('/:id', async (req, res) => {
	if (!req.body.completed) {
		if (!req.params.id) {
			let imgId = v4()

			imgdb.push({
				imgId: imgId,
				string: '',
				status: 'sending'
			})

			await imgdb.write()
			res.status(200).send(imgId)
		} else {
			const img = imgdb.data.find(i => i.imgId == req.params.id)
			img.string += req.body.string

			res.status(202).send(req.params.id)
		}
	} else if (req.params.id) {
		imgdb.data.find(i => i.imgId == req.params.id).status = 'end'

		await imgdb.write()
		res.status(202).send(req.params.id)
	} else {
		res.status(400).send()
	}
}).get('/:id', async (req, res) => {
	let img = imgdb.data.find(i => i.imgId == req.params.id)
	res.status(200).send()
})