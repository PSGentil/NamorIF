const input = document.querySelector("#profileImg")
input.addEventListener("change", () => {
    const reader = new FileReader()
    reader.readAsDataURL(input.files[0])
    reader.addEventListener('load', () => {
        uploadImg(reader.result)
    })
})

/**
 * @param {string} dataURL 
 * preciso mexer
 */
export async function uploadImg(dataURL) {
    let i, id
    for (i = 0; i <= dataURL.length; i += 100) {
        fetch('', {
            body: JSON.stringify({
                string: dataURL.slice(i, i + 100),
                complete: !(i + 100 < dataURL.length)
            })
        })
    }
    fetch(`/api/img/${id}`, {
        body: JSON.stringify({
            string: dataURL.slice(i)
        })
    })
}

export async function getImg(id) {
    /*return await fetch(`localhost:3000/api/img/${id}`, { method: 'GET' }).then(async res => {
        let blob = await res.blob()
        return URL.createObjectURL(blob)
    })*/
}

export const imgs = new Map()