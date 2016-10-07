"use strict";
class Packet {
    constructor(sender,sender_port, receiver,receiver_port, data){
        this.receiver = receiver;
        this.receiver_port = receiver_port;
        this.sender = sender;
        this.sender_port = sender_port;
        this.data = data;
    }
}
Packet.fromJSON = function(json){
    return new Packet(json.sender,json.sender_port, json.receiver,json.receiver_port, json.data)
};

module.exports= Packet;
