var net = require('net');
var uuid= require('uuid-v4');

var Connection = require('../models/connection');
var Packet = require('../models/packet');

var parser =require('./parser');
var crypto = require('./crypto');

module.exports=  function(config){
    var connections = [];
    const SERVER_ID = uuid();

    //SERVER SETUP
    var server = net.createServer(function (client) {
        client.setEncoding(config.default_encoding);
        var connection = new Connection(client, client.remoteAddress,client.remotePort);
        connections.push(connection);
        console.log(`-> ${connection.id} : Connection has been received`);
        var sendAcknowledgementPacket = (function(){
            var acknowledgementPacket = new Packet(SERVER_ID,connection.id,{
                ack : {}
            });
            send(acknowledgementPacket);
        })();
        client.on('data', function (data) {
            console.log(`-> ${connection.id} : Packet has been received`);
            var packet = crypto.decrypt(data);
            if(!parser.isValid(packet)){
                console.log(`-> ${connection.id} : Received packet is invalid`);
                return;
            }
            var parsedPacket = parser.decode(packet);

            if(parsedPacket.receiver_id === 'BROADCAST'){
                broadcast(parsedPacket);
            }else{
                send(parsedPacket)
            }
        });
        client.on('end', function () {
            console.log(`-> ${connection.id} : Connection has been lost`);
            connections.splice(connections.indexOf(connection), 1);
        });
    }).listen(config.port);


    //EXPORTABLE FUNCTIONS
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

    return {
        send: send,
        broadcast: broadcast,
        getConnectionById: getConnectionById,
        getAllConnections: getAllConnections
    }
};









