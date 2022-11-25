export default class util {
    /**
     * @type {Map<string, { id: string, string: string, completed: boolean }>}
     */
    static imgs = new Map()

    /**
     * @param {string} dataURL
     * @returns {Promise<string>} the image id
     */
    static async uploadImg(dataURL) {
        let i, id

        await fetch('/api/img', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' },
            body: JSON.stringify({
                string: dataURL.slice(0, 100),
                completed: false
            })
        }).then(async res => id = await res.text())

        for (i = 100; i <= dataURL.length; i += 100) {
            await fetch(`/api/img/${id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json; charset=UTF-8' },
                body: JSON.stringify({
                    string: dataURL.slice(i, i + 100),
                    completed: !(i + 100 < dataURL.length)
                })
            })
        }

        util.imgs.set(id, { id: id, string: dataURL, completed: true })
        return id
    }
    /**
     * @param {string} id imgId
     * @returns {Promise<string> | null} `dataURL` **OR** `null` if not found
     */
    static async getImg(id) {
        if (util.imgs.has(id)) return util.imgs.get(id).string

        const img = { id: id, string: '', completed: false }

        for (let i = 0; !img.completed; i += 100) {
            let status = await fetch(`/api/img/${id}/${i}`, { method: 'GET' }).then(async res => {
                if (res.ok) {
                    let body = await res.json()
                    img.string += body.string
                    if (body.completed) {
                        img.completed = true
                    }
                } else return 404
            })
            if (status == 404) break
        }

        if (img.completed) {
            util.imgs.set(img.id, img)
            return img.string
        } else return null
    }
    /**
     * @param {string} username 
     * @returns {Object} server data of user
     */
    static async getAccount(username) {
        return await (await fetch('/api/account', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' },
            body: JSON.stringify({
                username: username
            })
        })).json()
    }
    /**
     * @param {string} email 
     * @param {string} pass 
     */
    static enviarLogin(username, email, pass) {
        return fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' },
            body: JSON.stringify({
                username: username,
                email: email,
                pass: pass
            })
        })
    }
    /**
     * @param {string} email 
     * @param {string} pass 
     */
    static criarConta(username, email, pass, profilePhoto) {
        return fetch('/api/login/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' },
            body: JSON.stringify({
                username: username,
                email: email,
                pass: pass,
                profilePhoto: profilePhoto
            })
        })
    }
}