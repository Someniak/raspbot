"use strict";
class Packet {
    constructor(sender_id,receiver_id, data){
        this.sender_id = sender_id;
        this.receiver_id = receiver_id;
        this.data = data;
    }
}
Packet.fromJSON = function(json){
    return new Packet(json.sender_id,json.receiver_id, json.data)
};

module.exports= Packet;
