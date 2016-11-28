var net = require('net');
var uuid= require('uuid-v4');

var Connection = require('../models/connection');
var Packet = require('../models/packet');

var parser =require('./parser');
var crypto = require('./crypto');

var processor = require('./processor/processor');

module.exports=  function(config){
    var connections = [];
    const SERVER_ID = uuid();

    //SERVER SETUP
    var server = net.createServer(function (socket) {
        socket.setEncoding(config.default_encoding);

        var connection = new Connection(socket, socket.remoteAddress,socket.remotePort);
        connections.push(connection);
        console.log(`-> ${connection.id} : Connection has been received`);

        //AUTOMATICALLY SEND ACK PACKET
        send(new Packet(SERVER_ID,connection.id,{ack : {}}));

        socket.on('data', onData.bind({}, connection));
        socket.on('end', onEnd.bind({}, connection));
    }).listen(config.port);



    //FUNCTIONS CALLED ON EVENT
    var onData= function(connection,data){
        console.log(`-> ${connection.id} : Packet has been received`);
        var packet = crypto.decrypt(data);
        if(!parser.isValid(packet)){
            console.log(`-> ${connection.id} : Received packet is invalid`);
            return;
        }
        var parsedPacket = parser.decode(packet);

        if(parsedPacket.receiver_id === 'BROADCAST'){
            broadcast(parsedPacket);
        }else if(parsedPacket.receiver_id == SERVER_ID){
            process(parsedPacket);
        }else{
            send(parsedPacket);
        }
    };
    var onEnd = function(connection,data){
        console.log(`-> ${connection.id} : Connection has been lost`);
        connections.splice(connections.indexOf(connection), 1);
    };


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
    var process  = function(packet){
        //DO LOW LEVEL SHIT HERE

        //DO HIGH LEVEL SHIT AT PROCESSOR
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









