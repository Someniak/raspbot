var net = require('net');
var uuid= require('uuid-v4');
var Connection = require('../models/connection');
var Packet = require('../models/packet');
var parser =require('./parser');

module.exports=  function(config,websocket){
    var connections = [];
    const SERVER_ID = uuid();

    let server = net.createServer(function (socket) {
        socket.setEncoding(config.default_encoding);
        let connection = new Connection(socket, socket.remoteAddress,socket.remotePort);
        connections.push(connection);
        addNewConnection(connection);
        log(`-> ${connection.id} : Connection has been received`);

        send(new Packet(SERVER_ID,connection.id,{ack : ''}));
        socket.on('data', onData.bind({}, connection));
        socket.on('end', onEnd.bind({}, connection));
        socket.on('err', onError.bind({}, connection));
    }).listen(config.port);

    let onData= function(connection,data){
        log(`-> ${connection.id} : Packet has been received`);
        if(!parser.isValid(data)){
            log(`-> ${connection.id} : Received packet is invalid`);
            return;
        }
        let parsedPacket = parser.decode(data);

        if(parsedPacket.receiver_id === 'BROADCAST'){
            broadcast(parsedPacket);
        }else if(parsedPacket.receiver_id == SERVER_ID){
            processCmd(parsedPacket,connection);
        }else{
            send(parsedPacket);
        }
    };
    let onEnd = function(connection,data){
        log(`-> ${connection.id} : Connection has been lost`);
        connections.splice(connections.indexOf(connection), 1);
        removeConnection(connection);
    };

    let onError = function(connection,data){
        log(`-> ${connection.id} : Connection has been lost`);
        connections.splice(connections.indexOf(connection), 1);
        removeConnection(connection);
    };

    let send = function(packet){
        let connection = getConnectionById(packet.receiver_id);
        if(connection){
            log(`<- ${connection.id} : Sending data`);
            let parsedPacket = parser.encode(packet);
            connection.socket.write(parsedPacket);
        }
    };
    let broadcast = function(packet){
        log(`<- ${connection.id} : Sending broadcast`);
        connections.forEach((clientSocket) => {
            if (client === connection) return;
            let parsedPacket = parser.encode(packet);
            clientSocket.write(parsedPacket);
        })
    };
    let getConnectionById = function(id){
        let connection = connections.filter((connection)=> {
            return connection.id === id;
        });
        return connection.length > 0 ? connection[0] : null;
    };
    let getAllConnections = function(){
        return connections;
    };

    let processCmd = function(packet,connection){
        if(packet.data.hasOwnProperty('name')){
            connection.name = packet.data['name'];
            updateConnection(connection);
        }
        console.log(packet);
    };

    var sendCmd = function(receiverId,cmd){
        send(new Packet(SERVER_ID,receiverId,{cmd: cmd}))
    };
    var sendSig = function(receiverId, sig){
        send(new Packet(SERVER_ID,receiverId,{sig: sig}))
    };
    var broadcastCmd = function(receiverId, cmd){
        broadcast(new Packet(SERVER_ID,null, {cmd: cmd}))
    };
    var broadcastSig = function(receiverId, sig){
        broadcast(new Packet(SERVER_ID,null, {sig: sig}))
    };

    let log = function(message){
        console.log(message);
        websocket.send('info',message)
    };
    let addNewConnection = function(connection){
        websocket.send('new-connection',connection);
    };
    let removeConnection = function(connection){
        websocket.send('delete-connection',connection);
    };
    let updateConnection = function(connection){
        websocket.send('update-connection',connection);
    };

    return {
        getConnectionById: getConnectionById,
        getAllConnections: getAllConnections,
        sendCmd: sendCmd,
        sendSig: sendSig,
        broadcastCmd: broadcastCmd,
        broadcastSig: broadcastSig
    }
};









