const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    body: JSON.stringify({
        user: 'id',
        pass: 'asdhoasjd'
    })
}

fetch('http://localhost:3000/api/login', options)

menuActive = false

function expand(){
    
    let navBar = document.getElementsByTagName('nav')

    if (!menuActive){
        navBar[0].style.width = '50%'
        menuActive = true
    }else{
        navBar[0].style.width = '5%'
        menuActive = false
    }
    
}