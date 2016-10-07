var net = require('net'),
    Connection = require('./../models/connection'),
    parser =require('./../utils/parser'),
    processor =require('../utils/processor'),
    config = require('../config.json'),
    publicIp = require('public-ip');



var connections = [];
net.createServer(function (clientSocket) {
    //On connection push client to this list

    var connection = new Connection(clientSocket, clientSocket.remoteAddress,clientSocket.remotePort);
    connections.push(connection);

    //On data received from client
    clientSocket.on('data', function (packet) {
        console.log(`IN ${connection.ip}:${connection.port} : Data has been received`);
        var parsedData = parser.decode(packet);
        processor.execute(parsedData, send, broadcast).then(()=> {
            console.log(`${connection.port} : Data processed succesfully`);
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

var ipV4, ipV6;
publicIp.v4()
    .then((ip) => ipV4 = ip)
    .then(() => publicIp.v6())
    .then((ip) => ipV6 = ip)
    .then(() => {
        console.log(`Server is listening on ${ipV4}:${ipV6}`)
    });
