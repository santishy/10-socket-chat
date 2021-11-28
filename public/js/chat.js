let user = null;
let socket = null;

const url = window.location.hostname.includes('localhost') ? "http://localhost:8080/api/auth/" : "https://restserver-smoe.herokuapp.com/api/auth/"

//referencias html
const txtUid = document.querySelector('#txtUid');
const message = document.querySelector('#message');
const userList = document.querySelector('#userList');
const messageList = document.querySelector('#messageList');
const logout = document.querySelector('#logout');

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

const showUserList = (list) => {
    let template = '';
    list.forEach( user => {
        template += `<li>
            <h5><p class="text-success">${user.name}</p></h5>
            <span class="fs-6 text-muted">${user.uid}</span>
        </li>`; 
    })
    userList.innerHTML = template;
}
const showMessageList = (list) => {
    let template = '';
    list.forEach( ({message,name}) => {
        template += `<li>
            <span class="text-primary text-xs">${name}:</span>
            <span>${message}</span>
        </li>`; 
    })
    messageList.innerHTML = template;
}

const connect = async (token) => {
    socket = io({

        extraHeaders: {
            'x-token': localStorage.getItem('token'),
        }

    });

    //escuchas
    socket.on('connect', () => {
        console.log('socket online')
    });
    socket.on('disconnect', () => {
        console.log('socket deconectado')
    })
    socket.on('receive-message',(payload) => {
        console.log(payload)
        showMessageList(payload);
    });

    //no se manda el argumento por que una funcion (arg) => otrafunciono(arg), es equivalente a enviar solo el nombre d la funcion ya va implicito el argumento.
    socket.on('active-users',showUserList);

    socket.on('private-message',(payload) => {
        console.log(payload)
    });
}

message.addEventListener('keyup',({keyCode}) => {
    if(keyCode !== 13) return;
    if(!message.value.length) return;
    socket.emit('send-message',{message:message.value,uid:txtUid.value})
})
//const socket = io();