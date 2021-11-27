
class Message{
    constructor(uid,name,message)
    {
        this.uid = uid;
        this.name = name;
        this.message = message;
    }
}
class ChatMessage {

    constructor(){
        this.messages = [];
        this.users = {};
    }

    get lastTen(){
        return this.messages.slice(0,10);
    }

    get userList(){
        return Object.values(this.users)
    }

    sendMessage(uid,name,message){
        this.messages.unshift(new Message(uid,name,message));
    }

    loggedInUser(user){
        this.users[user.id] = user;
    }
    userDisconnected(id){
        delete this.users[id];
    }

}

module.exports = ChatMessage;