

const url = window.location.hostname.includes('localhost') ? "http://localhost:8080/api/auth/" : "https://restserver-smoe.herokuapp.com/api/auth/"

/**
 * 
 * login sistema
 */

const form = document.querySelector('form');

form.addEventListener('submit',(event) => {
    event.preventDefault();
    const formData = {};
    for (ele of form.elements) {
        if (ele.name.length > 0) {
            formData[ele.name] = ele.value;
        }
    }
    console.log({body:formData})
    fetch(url + 'login', {
        'method': 'POST',
        'headers': { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
        .then(res => res.json())
        .then(res => {
            const {msg,token} = res;
            if(!msg){
                localStorage.setItem('token',token);
                return;
            }
            console.log(msg);

        })
        .catch(err => { console.log(err) });
})



/**
 * 
 * login google 
 */
function handleCredentialResponse(response) {
    // decodeJwtResponse() is a custom function defined by you
    // to decode the credential response.
    //se serializa completo el objeto json y no solo el response.credential
    const body = JSON.stringify({ 'token_id': response.credential })
    /**
     * en fetch, se envia serializado un json {ab:9} y la respuesta en el then tambien se tiene que deserealizar .. por que asi trabaja el fetch
     */
    fetch(url + 'google', {
        'method': "post",
        'headers': {
            "Content-Type": "application/json",
        },
        body
    }).then(res => res.json())
        .then(res => {
            console.log(res);
            localStorage.setItem('email', res.email);
        }
        )
        .catch(err => console.warn)
}

const button = document.getElementById('google-sign-out');
button.onclick = function () {
    google.accounts.id.disableAutoSelect();
    google.accounts.id.revoke(localStorage.getItem('email'), (done) => {
        console.log(done);
        localStorage.clear();
        location.reload();
    })
}