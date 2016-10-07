"use strict";
class Packet {
    constructor(sender, receiver,data){
        this.receiver = receiver;
        this.sender = sender;
        this.data = data;
    }
}
Packet.fromJSON = function(json){
    return new Packet(json.sender, json.receiver, json.data)
};

module.exports= Packet;
