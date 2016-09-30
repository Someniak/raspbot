"use strict";
class Packet {
    constructor(sender, receivers,command){
        this.receivers = [];
        this.sender = sender;
        this.command = command;
    }
}
Packet.fromJSON = function(json){
    return new Packet(json.sender, json.receivers, json.command)
};

module.exports= Packet;
