var net = require('net');

var clients = [];

net.createServer(function (serverSocket) {

    serverSocket.name = serverSocket.remoteAddress + ":" + serverSocket.remotePort;
    clients.push(serverSocket);

    serverSocket.write("Welcome " + serverSocket.name + "\n");
    broadcast(serverSocket.name + " joined the chat\n", serverSocket);


    serverSocket.on('data', function (data) {
        var parsedData = JSON.parse(data);
        console.log(parsedData);
        broadcast(serverSocket.name + "> " + data, serverSocket);
    });

    serverSocket.on('end', function () {
        clients.splice(clients.indexOf(serverSocket), 1);
        broadcast(serverSocket.name + " left the chat.\n");
    });

    function broadcast(message, sender) {
        clients.forEach(function (client) {
            // Don't want to send it to sender
            if (client === sender) return;
            client.write(message);
        });
        // Log it to the server output too
        process.stdout.write(message)
    }

}).listen(5000);