var net = require('net');
var connectedClients = [];
var Bot = require('./../models/bot');
var parser =require('./../utils/parser');


net.createServer(function (clientSocket) {
    var bot = new Bot(clientSocket.remoteAddress,clientSocket.remotePort);
    connectedClients.push(bot);


    clientSocket.on('data', function (data) {
        var parsedData = parser.decode(data);
        console.log(parsedData);
        broadcast(clientSocket.name + "> " + data, clientSocket);
    });

    clientSocket.on('end', function () {
        connectedClients.splice(connectedClients.indexOf(clientSocket), 1);
        broadcast(clientSocket.name + " left the chat.\n");
    });

    function broadcast(message, sender) {
        connectedClients.forEach(function (client) {
            // Don't want to send it to sender
            if (client === sender) return;
            clientSocket.write(message);
        });
        // Log it to the server output too
        process.stdout.write(message)
    }

}).listen(5000);