const { checkToken } = require("../helpers");
const { ChatMessage } = require("../models")

const chatMessage = new ChatMessage();

const socketController = async (socket, io) => {
    //socket connect 
    const user = await checkToken(socket.handshake.headers['x-token']);
    if (!user)
        return socket.disconnect();

    //le asignamos una sala , para poder mandar mensajes privados
    socket.join(user.id);

    //despues de validar el socket

    chatMessage.loggedInUser(user);

    io.emit('active-users', chatMessage.userList);

    socket.emit('receive-message',chatMessage.lastTen)

    socket.on('disconnect', () => {
        chatMessage.userDisconnected(user.id);
        io.emit('active-users', chatMessage.userList);
    })

    socket.on('send-message', ({ message = '', uid = '' }) => {
        if(uid.length>0){
            socket.to(uid).emit('receive-message',{from:user.name,message});
            return;
        }
        chatMessage.sendMessage(user.id, user.name, message);
        io.emit('receive-message', chatMessage.lastTen);
    })
}

module.exports = { socketController }