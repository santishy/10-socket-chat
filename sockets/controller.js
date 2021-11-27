const { checkToken } = require("../helpers");
const {ChatMessage} = require("../models")

const chatMessage = new ChatMessage();

const socketController = async (socket,io) => {
    //socket connect 
    const user = await checkToken(socket.handshake.headers['x-token']);
    if (!user)
        return socket.disconnect();
    
        //despues de validar el socket

    chatMessage.loggedInUser(user);

    io.emit('active-users',chatMessage.userList);
    
    socket.on('disconnect', () => {
        chatMessage.userDisconnected(user.id);
        io.emit('active-users',chatMessage.userList);
    })

    socket.on('send-message',({message = '',uid = ''}) => {
        chatMessage.sendMessage(user.id,user.name,message);
        io.emit('receive-message',chatMessage.lastTen);
    })
}

module.exports = { socketController }