var net = require('net'),
    Connection = require('./../models/connection'),
    parser =require('./../utils/parser'),
    processor =require('../processor/processor'),
    config = require('../config.json'),
    publicAddress = require('public-address');

var connections = [];
net.createServer(function (clientSocket) {
    //On connection push client to this list

    var connection = new Connection(clientSocket, clientSocket.remoteAddress,clientSocket.remotePort);
    connections.push(connection);

    //On data received from client
    clientSocket.on('data', function (packet) {
        console.log(`IN ${connection.ip}:${connection.port} : Data has been received`);
        var parsedPacket = parser.decode(packet);
        processor.execute(parsedPacket).then((outgoingPacket)=> {
            if(outgoingPacket.receiver === '0.0.0.0'){
                broadcast(outgoingPacket);
            }else{
                send(outgoingPacket)
            }
        });
    });

    //On connection lost
    clientSocket.on('end', function () {
        console.log(`IN ${connection.ip}:${connection.port} : Connection has been lost`);
        connections.splice(connections.indexOf(connection), 1);
    });

    var send = function(packet){
        var connection = getConnectionByIpAndPort(packet.ip,packet.port);
        if(connection){
            console.log(`OUT ${connection.ip}:${connection.port} : Sending data`);
            let parsedPacket = parser.encode(packet);
            connection.socket.write(packet);
        }

    };
    var broadcast = function(packet){
        console.log(`OUT ${connection.ip}:${connection.port} : Sending broadcast`);
        connections.forEach((clientSocket) => {
            if (client === connection) return;
            let parsedPacket = parser.encode(packet);
            clientSocket.write(parsedPacket);
        })
    };

    var getConnectionByIpAndPort = function(ip, port){
        return connections.filter((connection)=> {
            return connection.ip === ip && connection.port === port;
        })
    }
}).listen(config.default_server_port);



console.log('Server is running on ...');
publicAddress(function(err,data){
    console.log(data.address);
});
