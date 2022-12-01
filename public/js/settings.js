
let userInfos = {
    username: window.localStorage.getItem('username'),
    email: window.localStorage.getItem('email'),
    showme: window.localStorage.getItem('showme'),
    sexuality: window.localStorage.getItem('sexuality') 
}

for (const key in userInfos) {

    console.log(`#new${key} label`)
    document.querySelector(`label[for="new${key}"]`).innerText += userInfos[key]

}


async function save(e) {



    let dadosEnviados = {
        usernameChange: usernameChange,
        emailChange: emailChange,
        meMostreChange: meMostreChange,
        euSouChange: euSouChange,
    }

    let camposValidados = util.checarCamposVazios(dadosEnviados)

    if (camposValidados == true) {
        await fetch('/api/account/edit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' },
            body: JSON.stringify({
                username: usernameChange,
                email: email,
                newEmail: emailChange,
                showme: meMostreChange,
                sexuality: euSouChange,
                pass: senha

            })
        })
    } else {
        window.alert(camposValidados)
    }
}