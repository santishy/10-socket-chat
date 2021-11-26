const { checkToken } = require("../helpers");

const socketController = async(socket) => {
    const user = await checkToken(socket.handshake.headers['x-token']);
    if(!user)
       return socket.disconnect();
    console.log('conectado ',user.name)
}

module.exports = {socketController}