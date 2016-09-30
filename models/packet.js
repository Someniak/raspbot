class Packet {
    constructor(sender, receivers,command){
        this.receivers = [];
        this.sender = sender;
        this.command = command;
    }
}

module.exports= Packet;