import util from './util.js'

export default class settings {
    static accountConfigPopup() {
        if (!document.getElementsByTagName('main')[0].contains(document.getElementById('accountConfigPopup'))) {
            const accountConfigPage = document.createElement('div')
            const closeImg = document.createElement('img')
            const accountInfo = document.createElement('section')

            const username = document.createElement('div')
            const email = document.createElement('div')
            const meMostre = document.createElement('div')
            const euSou = document.createElement('div')

            const usernameLabel = document.createElement('label')
            const emailLabel = document.createElement('label')
            const meMostreLabel = document.createElement('label')
            const euSouLabel = document.createElement('label')
            const saveButton = document.createElement('button')

            let usernameP = document.createElement('textarea')
            let emailP = document.createElement('textarea')
            let meMostreP = document.createElement('p')
            let euSouP = document.createElement('p')

            document.getElementsByTagName('main')[0].appendChild(accountConfigPage)
            accountConfigPage.appendChild(closeImg)
            accountConfigPage.appendChild(accountInfo)
            accountInfo.appendChild(username)
            accountInfo.appendChild(email)
            accountInfo.appendChild(meMostre)
            accountInfo.appendChild(euSou)
            accountInfo.appendChild(saveButton)

            username.appendChild(usernameLabel)
            email.appendChild(emailLabel)
            meMostre.appendChild(meMostreLabel)
            euSou.appendChild(euSouLabel)

            username.appendChild(usernameP)
            email.appendChild(emailP)
            meMostre.appendChild(meMostreP)
            euSou.appendChild(euSouP)

            accountConfigPage.id = 'accountConfigPopup'
            accountConfigPage.style.display = 'block'

            closeImg.src = 'images/close.png'
            closeImg.className = 'close'
            closeImg.id = 'closeAccountSettings'

            accountInfo.id = 'settingsPageAccountInfo'

            usernameLabel.innerText = 'Nome de Usuário: '
            emailLabel.innerText = 'E-mail: '
            meMostreLabel.innerText = 'Me mostre: '
            euSouLabel.innerText = 'Eu Sou: '
            saveButton.value = 'Salvar Alterações'

            usernameP.innerText = window.localStorage.getItem('username')
            emailP.innerText = window.localStorage.getItem('email')
            euSouP.innerText = window.localStorage.getItem('sexuality')
            switch (window.localStorage.getItem('showme')) {
                case 'procuraMulher':
                    meMostreP.innerText = 'Mulheres'
                    break
                case 'procuraHomem':
                    meMostreP.innerText = 'Homens'
                    break
                case 'procuraTodos':
                    meMostreP.innerText = 'Todos'
                    break
            }

            meMostreP.addEventListener('click', editSpinner)
            euSouP.addEventListener('click', editSpinner)
            saveButton.addEventListener('click', save)

            function editSpinner(e) {

                console.log(e.target)

                if (e.target == meMostreP) {
                    if (!e.target.innerHTML.includes('<select>') && !e.target.innerHTML.includes('<option>'))
                        e.target.innerHTML = '<select id="meMostreChange"><option>Homens</option><option>Mulheres</option><option>Todos</option></select>'
                } else {
                    if (!e.target.innerHTML.includes('<select>') && !e.target.innerHTML.includes('<option>')) {
                        e.target.innerHTML = '<select id="euSouValue"><option>Hétero</option><option>Gay</option><option>Lésbica</option><option>Bissexual</option><option>Outro</option></select>'
                    }
                }
            }

            async function save(e) {

                let usernameChange = document.getElementById('usernameChange').value
                let emailChange = document.getElementById('emailChange').value
                let meMostreChange = document.getElementById('meMostreChange').value
                let euSouChange = document.getElementById('euSouValue').value
                let senha = window.localStorage.getItem('pass')
                let email = window.localStorage.getItem('email')

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
                }else{
                    window.alert(camposValidados)
                }
            }

        } else {
            if (accountConfigPopup.style.display == 'none') accountConfigPopup.style.display = 'block'
            else accountConfigPopup.style.display = 'none'
        }
    }
}