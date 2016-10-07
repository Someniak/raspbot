"use strict";
var Packet = require('../models/packet');

module.exports.decode = function(packet){
    return Packet.fromJSON(JSON.parse(packet));
};
module.exports.encode = function(packet){
    return JSON.stringify(packet);
};
