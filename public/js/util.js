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
                string: dataURL.slice(0, 1000),
                completed: false
            })
        }).then(async res => id = await res.text())

        for (i = 1000; i <= dataURL.length; i += 1000) {
            await fetch(`/api/img/${id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json; charset=UTF-8' },
                body: JSON.stringify({
                    string: dataURL.slice(i, i + 1000),
                    completed: !(i + 1000 < dataURL.length)
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

        for (let i = 0; !img.completed; i += 1000) {
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
     * @param {string} usernameOrEmail 
     * @param {string} pass 
     */
    static enviarLogin(usernameOrEmail, pass) {
        return fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' },
            body: JSON.stringify({
                username: (usernameOrEmail.includes('@') ? '' : usernameOrEmail),
                email: (usernameOrEmail.includes('@') ? usernameOrEmail : ''),
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
    /**
     * @param {string} src dataURL
     * @returns {Promise<HTMLImageElement>} loaded image
     */
    static async loadImage(src) {
        return new Promise(resolve => {
            const img = document.createElement('img')
            img.src = src
            img.complete ? resolve(img) : img.addEventListener('load', () => {
                resolve(img)
            })
        })
    }
    /**
     * @param {string} src
     * @param {number} maxWidth
     * @returns {Promise<HTMLImageElement>} resized image
     */
    static async resizeImage(src, maxWidth) {
        const image = await util.loadImage(src)
        let canvas = document.createElement('canvas')
        let opt = { width: maxWidth }

        if (opt.width && !opt.height) {
            opt.height = image.height * (opt.width / image.width)
        } else if (!opt.width && opt.height) {
            opt.width = image.width * (opt.height / image.height)
        }

        Object.assign(canvas, opt).getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height)
        return util.loadImage(canvas.toDataURL())
    }
    /**
     * @param {string} url dataURL
     * @param {number} maxWidth new img size
     * @param {number} ratio aspect ratio (1, 16/9)
     * @returns {Promise<string>} the resulting image as dataURL
     */
    static async cropImage(url, maxWidth = 720, ratio = 1) {
        return new Promise(async resolve => {
            const inputImage = await util.resizeImage(url, maxWidth)
            const inputWidth = inputImage.naturalWidth
            const inputHeight = inputImage.naturalHeight
            const inputImageAspectRatio = inputWidth / inputHeight

            let outputWidth = inputWidth
            let outputHeight = inputHeight
            if (inputImageAspectRatio > ratio) {
                outputWidth = inputHeight * ratio
            } else if (inputImageAspectRatio < ratio) {
                outputHeight = inputWidth / ratio
            }

            const outputX = (outputWidth - inputWidth) * 0.5
            const outputY = (outputHeight - inputHeight) * 0.5

            const outputImage = document.createElement('canvas')

            outputImage.width = outputWidth
            outputImage.height = outputHeight

            outputImage.getContext('2d').drawImage(inputImage, outputX, outputY)
            resolve(outputImage.toDataURL())
        })
    }
}