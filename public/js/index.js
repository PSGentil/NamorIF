const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    body: JSON.stringify({
        user: 'id',
        pass: 'asdhoasjd'
    })
}

fetch('http://localhost:3000/api/login', options)

let menuActive = false

function expand(){
    
    let navBar = document.getElementsByTagName('nav')
    let icons = document.getElementsByClassName('icons')

    if (!menuActive){
        navBar[0].style.width = '50%'
        icons[0].style.margin = '0 0 0 90%'
        icons[1].style.margin = '0 0 0 90%'
        menuActive = true
    }else{
        navBar[0].style.width = '5%'
        icons[0].style.margin = '0 auto'
        icons[1].style.margin = '0 auto'
        menuActive = false
    }
    
}

function loginPage(){
    
}