"use strict";
class Connection{
    constructor(socket,ip,port){
        this.socket = socket;
        this.ip = ip;
        this.port = port;
    }
}

module.exports = Connection;