"use strict";
const uuid = require('uuid-v4');
class Connection{
    constructor(socket,ip,port,name=""){
        this.socket = socket;
        this.ip = ip;
        this.port = port;
        this.name = name;
        this.id = uuid();
    }
}

module.exports = Connection;