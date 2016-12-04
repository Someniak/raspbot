var net = require('net');
var uuid= require('uuid-v4');

var Connection = require('../models/connection');
var Packet = require('../models/packet');

var parser =require('./parser');
var crypto = require('./crypto');


module.exports=  function(config){
    var connections = [];
    const SERVER_ID = uuid();

    var server = net.createServer(function (socket) {
        socket.setEncoding(config.default_encoding);

        var connection = new Connection(socket, socket.remoteAddress,socket.remotePort);
        connections.push(connection);
        console.log(`-> ${connection.id} : Connection has been received`);

        //AUTOMATICALLY SEND ACK PACKET
        send(new Packet(SERVER_ID,connection.id,{ack : {}}));

        socket.on('data', onData.bind({}, connection));
        socket.on('end', onEnd.bind({}, connection));
        socket.on('err', onError.bind({}, connection));
    }).listen(config.port);

    var onData= function(connection,data){
        console.log(`-> ${connection.id} : Packet has been received`);

        var packet = crypto.decrypt(data);
        if(!parser.isValid(packet)){
            console.log(`-> ${connection.id} : Received packet is invalid`);
            return;
        }
        var parsedPacket = parser.decode(packet);

        if(parsedPacket.receiver_id === 'BROADCAST'){
            broadcast(parsedPacket);
        }else if(parsedPacket.receiver_id == SERVER_ID){
            processCmd(parsedPacket,connection);
        }else{
            send(parsedPacket);
        }
    };
    var onEnd = function(connection,data){
        console.log(`-> ${connection.id} : Connection has been lost`);
        connections.splice(connections.indexOf(connection), 1);
    };

    var onError = function(connection,data){
        console.log(`-> ${connection.id} : Connection has been lost`);
        connections.splice(connections.indexOf(connection), 1);
    };

    var send = function(packet){
        var connection = getConnectionById(packet.receiver_id);
        if(connection){
            console.log(`<- ${connection.id} : Sending data`);
            let parsedPacket = parser.encode(packet);
            let data = crypto.encrypt(parsedPacket);
            connection.socket.write(data);
        }
    };
    var broadcast = function(packet){
        console.log(`<- ${connection.id} : Sending broadcast`);
        connections.forEach((clientSocket) => {
            if (client === connection) return;
            let parsedPacket = parser.encode(packet);
            let data = crypto.encrypt(parsedPacket);
            clientSocket.write(data);
        })
    };
    var getConnectionById = function(id){
        let connection = connections.filter((connection)=> {
            return connection.id === id;
        });
        return connection.length > 0 ? connection[0] : null;
    };
    var getAllConnections = function(){
        return connections;
    };

    var processCmd = function(packet,connection){
        if(packet.data.hasOwnProperty('name')){
            connection.name = packet.data['name'];
        }
        console.log(packet);
        console.log(packet.data);
    };

    var sendCmd = function(receiverId,cmd){
        send(new Packet(SERVER_ID,receiverId,{cmd: cmd}))
    };
    var sendSig = function(receiverId, sig){
        console.log(sig);
        send(new Packet(SERVER_ID,receiverId,{sig: sig}))
    };
    var broadcastCmd = function(receiverId, cmd){
        broadcast(new Packet(SERVER_ID,null, {cmd: cmd}))
    };
    var broadcastSig = function(receiverId, sig){
        broadcast(new Packet(SERVER_ID,null, {sig: sig}))
    };

    return {
        getConnectionById: getConnectionById,
        getAllConnections: getAllConnections,
        sendCmd: sendCmd,
        sendSig: sendSig
    }
};









