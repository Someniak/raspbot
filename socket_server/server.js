var uuid= require('uuid-v4');
var Connection = require('../models/connection');
var Packet = require('../models/packet');
var parser =require('./parser');
var crypto = require('./crypto');

module.exports=  function(config,websocket){
    var connections = [];
    const SERVER_ID = uuid();

    var io = require('socket.io')(config.port);
    io.on('connection', function(socket){
        let connection = new Connection(socket, socket.request.connection.remoteAddress,socket.request.connection.remotePort);
        connections.push(connection);
        addNewConnection(connection);
        log(`-> ${connection.id} : Connection has been received`);

        send(new Packet(SERVER_ID,connection.id,{ack : ''}));
        socket.on('data', onData.bind({},connection));
        socket.on('disconnect', onEnd.bind({}, connection));
    });

    /*
    Processes received data on socket
     */
    let onData= function(connection,cipher){
        let data= crypto.decrypt(cipher);

        log(`-> ${connection.id} : Packet has been received`);

        if(!parser.isValid(data)){
            log(`-> ${connection.id} : Received packet is invalid`);
            return;
        }
        let parsedPacket = parser.decode(data);
        if(parsedPacket.receiver_id === 'BROADCAST'){
            broadcast(parsedPacket);
        }else if(parsedPacket.receiver_id == SERVER_ID){
            processCmd(parsedPacket,connection);
        }else{
            send(parsedPacket);
        }
    };

    /*
    Handles data on end and error
     */

    let onEnd = function(connection,data){
        log(`-> ${connection.id} : Connection has been lost`);
        connections.splice(connections.indexOf(connection), 1);
        removeConnection(connection);
    };

    /*
    Send data over socket
     */

    let send = function(packet){
        let connection = getConnectionById(packet.receiver_id);
        if(connection){
            log(`<- ${connection.id} : Sending data`);
            let parsedPacket = parser.encode(packet);
            let cipher = crypto.encrypt(parsedPacket);
            connection.socket.emit('data',cipher);
        }
    };

    /*
    Brooadcast data over socket
     */
    let broadcast = function(packet){
        connections.forEach((connection) => {
            log(`<- ${connection.id} : Sending broadcast`);
            packet.receiver_id = connection.id;
            let parsedPacket = parser.encode(packet);
            let cipher = crypto.encrypt(parsedPacket);
            connection.socket.emit('data',cipher);
        })
    };

    /*
    Get connection by id
     */
    let getConnectionById = function(id){
        let connection = connections.filter((connection)=> {
            return connection.id === id;
        });
        return connection.length > 0 ? connection[0] : null;
    };

    /*
    Get all connections on server
     */
    let getAllConnections = function(){
        return connections;
    };

    /*
    Process command
     */
    let processCmd = function(packet,connection){
        if(packet.data.hasOwnProperty('name')){
            connection.name = packet.data['name'];
            updateConnection(connection);
        }
        pushDataToSocket(packet);
    };

    var sendCmd = function(receiverId,cmd){
        send(new Packet(SERVER_ID,receiverId,{cmd: cmd}))
    };
    var broadcastCmd = function(cmd){
        broadcast(new Packet(SERVER_ID,null, {cmd: cmd}))
    };
    let log = function(message){
        console.log(message);
        websocket.send('info',message)
    };
    let addNewConnection = function(connection){
        websocket.send('new-connection',connection);
    };
    let removeConnection = function(connection){
        websocket.send('delete-connection',connection);
    };
    let updateConnection = function(connection){
        websocket.send('update-connection',connection);
    };
    let pushDataToSocket = function(data){
        websocket.send('data',data);
    };


    return {
        getConnectionById: getConnectionById,
        getAllConnections: getAllConnections,
        sendCmd: sendCmd,
        broadcastCmd: broadcastCmd
    }
};









