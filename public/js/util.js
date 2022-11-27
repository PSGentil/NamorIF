import imgs from './imgs.js'

export default class util {
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

        imgs.set(id, { id: id, string: dataURL, completed: true })
        return id
    }
    /**
     * @param {string} id imgId
     * @returns {Promise<string> | null} `dataURL` **OR** `null` if not found
     */
    static async getImg(id) {
        if (imgs.get(id)) return imgs.get(id).string

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
            imgs.set(img)
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
     * @param {{nome: string, sobrenome: string, username: string, email: string, pass: string, birthdate: number, sexuality: string, showme: string, profilePhoto: string}} info
     */
    static async criarConta(info) {
        let resposta

        await fetch('/api/account/validate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' },
            body: JSON.stringify({
                email: info.email,
                username: info.username,
            })
        }).then(async res => {
            if (res.ok) resposta = await res.text()
            else resposta = false
        })

        switch (resposta) {
            case false:
                fetch('/api/login/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
                    body: JSON.stringify(info)
                }).then(async res => {
                    if (res.ok) {
                        for (const key in info) {
                            window.localStorage.setItem(key, info[key])
                        }
                        window.localStorage.setItem('isLogged', true)

                        window.location.href = '../pages/account.html'
                    }
                })
                break
            case 'email':
                window.alert('email usado')
                break
            case 'username':
                window.alert('username usado')
                break
            case 'email&username':
                window.alert('email e username usados')
                break
        }
    }
    /**
     * @param {HTMLFormElement[]} etapas 
     * @param {number} etapaAtual 
     */
    static atualizarEtapaCadastro(etapas, etapaAtual) {
        for (let i = 0; i < etapas.length; i++) {
            if (i == etapaAtual) {
                etapas[i].style.display = 'block'
            } else {
                etapas[i].style.display = 'none'
            }
        }
    }
    /**
     * @param {Object<string, string>} valores 
     * @returns {true | string}
     */
    static checarCamposVazios(valores) {
        for (const key in valores) {
            if (!valores[key] || valores[key] == 'placeholder') return key
        }
        return true
    }
}