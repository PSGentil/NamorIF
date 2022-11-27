export default class imgs {
    /**
     * @returns {Object<string, {id: string, string: string, completed: boolean}>}
     */
    static read() {
        if (!localStorage.getItem('imgs')) localStorage.setItem('imgs', '{}')
        return JSON.parse(localStorage.getItem('imgs'))
    }
    /**
     * @param {string} id
     */
    static get(id) {
        return this.read()[id]
    }
    /**
     * @param {string} id
     * @param {{id: string, string: string, completed: boolean}} img
     */
    static set(img) {
        let obj = this.read()
        obj[img.id] = img
        localStorage.setItem('imgs', JSON.stringify(obj))
    }
}