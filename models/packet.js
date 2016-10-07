"use strict";
class Packet {
    constructor(sender, receivers,data){
        this.receivers = [];
        this.sender = sender;
        this.data = data;
    }
}
Packet.fromJSON = function(json){
    return new Packet(json.sender, json.receivers, json.data)
};

module.exports= Packet;
