"use strict";
const uuid = require('uuid-v4');
class Connection{
    constructor(socket,ip,port){
        this.socket = socket;
        this.ip = ip;
        this.port = port;
        this.id = uuid();
    }
}

module.exports = Connection;