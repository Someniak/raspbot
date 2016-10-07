var net = require('net');
var connections = [];
var Connection = require('./../models/connection');
var parser =require('./../utils/parser');
var processor =require('../utils/processor');


net.createServer(function (clientSocket) {
    //On connection push client to this list

    var connection = new Connection(clientSocket, clientSocket.remoteAddress,clientSocket.remotePort);
    connections.push(connection);

    //On data received from client
    clientSocket.on('data', function (packet) {
        console.log(`${connection.ip}:${connection.port} : Data has been received`);
        var parsedData = parser.decode(packet);
        processor.execute(parsedData, send, broadcast).then(()=> {
            console.log(`${connection.port} : Data processed succesfully`);
        });
    });

    //On connection lost
    clientSocket.on('end', function () {
        console.log(`${connection.ip}:${connection.port} : Connection has been lost`);
        connections.splice(connections.indexOf(connection), 1);
    });

    var send = function(data){

    };
    var broadcast = function(){
        connections.forEach((client) => {
            if (client === sender) return;
        })
    };


}).listen(5000);

function broadcast(message, sender) {
    connectedClients.forEach(function (client) {
        // Don't want to send it to sender
        if (client === sender) return;
        clientSocket.write(message);
    });
    // Log it to the server output too
    process.stdout.write(message)
}