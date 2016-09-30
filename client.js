var net = require('net');
var Packet = require('./models/packet.js');


var clientSocket = new net.Socket();
const ip = '127.0.0.1',
    port = 5000;

clientSocket.connect(5000, '127.0.0.1', function() {
    console.log('Connected');
    var packet = new Packet('localhost','receiver','rm -rf /');
    const data = JSON.stringify(packet);
    clientSocket.write(data);
});

clientSocket.on('data', function(data) {
    console.log('Received: ' + data);
    clientSocket.destroy(); // kill clientSocket after server's response
});

clientSocket.on('close', function() {
    console.log('Connection closed');
});