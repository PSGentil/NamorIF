import { Router } from "express"
import { Low } from "lowdb"
import { JSONFile } from "lowdb/node"
import { v4 } from 'uuid'
import fs from 'fs'

export const imgdb = new Low(new JSONFile("./src/database/imgdb.json"))
await imgdb.read(); imgdb.data ||= []; await imgdb.write()

export default Router().post('/', async (req, res) => {
	//começar upload
	let id = v4()
	imgdb.data.push({
		id: id,
		string: req.body.string,
		completed: false
	})
	res.status(200).send(id)
}).post('/:id', async (req, res) => {
	if (!req.body.completed) {
		//continuar upload
		const img = imgdb.data.find(i => i.id == req.params.id)
		img.string += req.body.string
		res.status(202).send(req.params.id)
	} else if (req.body.completed) {
		//finalizar upload
		const img = imgdb.data.find(i => i.id == req.params.id)
		img.string += req.body.string
		img.path = `./src/database/images/${img.id}.png`

		fs.writeFileSync(img.path, Buffer.from(img.string.replace('data:image/png;base64,', ''), 'base64'))

		delete img.string
		img.completed = true
		await imgdb.write()
		res.status(202).send(req.params.id)
	} else {
		res.status(400).send()
	}
}).get('/:id/:part', async (req, res) => {
	let img = imgdb.data.find(i => i.id == req.params.id)

	if (img) {
		if (!img.string) {
			img.string = 'data:image/png;base64,' + fs.readFileSync(img.path).toString('base64')
		}

		res.status(200).send({
			string: img.string.slice(req.params.part, req.params.part + 3000),
			completed: !(req.params.part + 3000 < img.string.length)
		})

		if (!(req.params.part + 3000 < img.string.length)) {
			delete img.string
			await imgdb.write()
		}
	} else res.status(404).send()
}).delete('/:id', async (req, res) => {
	let img = imgdb.data.findIndex(i => i.id == req.params.id)

	if (img != -1) {
		fs.unlinkSync(imgdb.data[img].path)
		imgdb.data.splice(img, 1)
		await imgdb.write()
		res.status(200).send()
	} else res.status(404).send()
})