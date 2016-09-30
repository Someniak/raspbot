"use strict";
class Bot{

    constructor(ip,port){
        this.ip = ip;
        this.port = port;
        this.alive = true;
    }
    setAlive(){
        this.alive = true;
    }
    setDead(){
        this.alive = false;
    }
}
Bot.fromJson = function(json){
    return new Bot(json.ip,json.port);
};
module.exports= Bot;