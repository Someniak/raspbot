var net = require('net'),
    Connection = require('./../models/connection'),
    parser =require('./../utils/parser'),
    processor =require('../utils/processor'),
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
        var parsedData = parser.decode(packet);
        processor.execute(parsedData, send, broadcast).then((data)=> {
            console.log(`${connection.ip}:${connection.port} : ${data}`);
        });
    });

    //On connection lost
    clientSocket.on('end', function () {
        console.log(`IN ${connection.ip}:${connection.port} : Connection has been lost`);
        connections.splice(connections.indexOf(connection), 1);
    });

    var send = function(data){
        console.log(`OUT ${connection.ip}:${connection.port} : Sending data`);
        clientSocket.send(data);
    };
    var broadcast = function(data){
        console.log(`OUT ${connection.ip}:${connection.port} : Sending broadcast`);
        connections.forEach((clientSocket) => {
            if (client === connection) return;
            clientSocket.write(data);
        })
    };
}).listen(config.default_server_port);



console.log('Server is running on ...');
publicAddress(function(err,data){
    console.log(data.address);
});
