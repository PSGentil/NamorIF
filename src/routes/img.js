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
	setTimeout(async () => {

		const imgIndex = imgdb.data.findIndex(i => i.id == id && !i.completed)
		if (imgIndex != -1) imgdb.data.splice(imgIndex, 1)
		await imgdb.write()

	}, 5 * 60 * 1000)
	res.status(200).send(id)
}).post('/single', async (req, res) => {
	//single upload
	let id = v4()

	fs.writeFileSync(`./src/database/images/${id}.png`, Buffer.from(req.body.string.replace('data:image/png;base64,', ''), 'base64'))

	imgdb.data.push({
		id: id,
		path: `./src/database/images/${id}.png`,
		completed: true
	})
	await imgdb.write()
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
}).get('/:id/:speed/:part', async (req, res) => {
	let img = imgdb.data.find(i => i.id == req.params.id)

	if (img) {
		if (!img.string) {
			img.string = 'data:image/png;base64,' + fs.readFileSync(img.path).toString('base64')
		}

		res.status(200).send({
			string: img.string.slice(Number(req.params.part), Number(req.params.part) + Number(req.params.speed)),
			completed: !(Number(req.params.part) + Number(req.params.speed) < img.string.length)
		})

		if (!(Number(req.params.part) + Number(req.params.speed) < img.string.length)) {
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

const imgs = imgdb.data.filter(i => !i.completed)
for (const img of imgs) {
	const imgIndex = imgdb.data.findIndex(i => i.id == img.id)
	if (imgIndex != -1) imgdb.data.splice(imgIndex, 1)
}
await imgdb.write()