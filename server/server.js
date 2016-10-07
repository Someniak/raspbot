var net = require('net'),
    Connection = require('./../models/connection'),
    parser =require('./../utils/parser'),
    processor =require('../processor/processor'),
    config = require('../config.json'),
    publicAddress = require('public-address'),
    Packet = require('../models/packet'),
    uuid = require('uuid-v4');

const SERVER_ID = uuid();

var connections = [];
net.createServer(function (clientSocket) {
    //On connection push client to this list

    var connection = new Connection(clientSocket, clientSocket.remoteAddress,clientSocket.remotePort);
    connections.push(connection);
    console.log(`IN ${connection.id} : Connection has been received`);

    var sendAcknowledgementPacket = function(){
        var acknowledgementPacket = new Packet(SERVER_ID,connection.id,{
            ack : {}
        });
        send(acknowledgementPacket);
    };


    //On data received from client
    clientSocket.on('data', function (packet) {
        console.log(`IN ${connection.id} : Data has been received`);
        var parsedPacket = parser.decode(packet);

        if(parsedPacket.receiver_id === 'BROADCAST'){
            broadcast(parsedPacket);
        }else{
            send(parsedPacket)
        }
    });

    //On connection lost
    clientSocket.on('end', function () {
        console.log(`IN ${connection.id} : Connection has been lost`);
        connections.splice(connections.indexOf(connection), 1);
    });

    var send = function(packet){
        var connection = getConnectionById(packet.receiver_id);
        if(connection){
            console.log(`OUT ${connection.id} : Sending data`);
            let parsedPacket = parser.encode(packet);
            connection.socket.write(parsedPacket);
        }

    };
    var broadcast = function(packet){
        console.log(`OUT ${connection.id} : Sending broadcast`);
        connections.forEach((clientSocket) => {
            if (client === connection) return;
            let parsedPacket = parser.encode(packet);
            clientSocket.write(parsedPacket);
        })
    };

    var getConnectionById = function(id){
        let connection = connections.filter((connection)=> {
            return connection.id === id;
        });
        return connection.length > 0 ? connection[0] : null;
    };
    sendAcknowledgementPacket();
}).listen(config.default_server_port);


console.log('Server is running on ...');
publicAddress(function(err,data){
    console.log(data.address);
});
