"use strict";
var Packet = require('../models/packet');

module.exports.decode = function(data){
    return Packet.fromJSON(JSON.parse(data));
};
module.exports.encode = function(packet){
    return JSON.stringify(packet);
};
