let user = null;
let socket = null;

const url = window.location.hostname.includes('localhost') ? "http://localhost:8080/api/auth/" : "https://restserver-smoe.herokuapp.com/api/auth/"

renewToken = async () => {
    let token = localStorage.getItem('token') || '';
    if (token.length < 10) {
        window.location = 'index.html'
        throw new Error('No existe el token')
    }
    const res = await fetch(url, {
        'method': 'get',
        'headers': {
            'x-token': token
        }
    })

    const { currentUser, token: tokenDB } = await res.json();

    user = currentUser;
    token = tokenDB;
    document.title = currentUser.name;
    localStorage.setItem('token', token);
    await connect(token);

};
const main = async () => {

    await renewToken();
}

main();

const connect = async (token) => {
    socket = io({

        extraHeaders: {
            'x-token': localStorage.getItem('token'),
        }

    })
}
//const socket = io();