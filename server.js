//Configuration
var config = require('./config.json');
//var logger = require('./utils/logger');

//Basic socketserver
var socketServer =require('./socket_server/server')({port: config.default_socket_server_port,default_encoding: 'utf8'});
var webServer =require('./web_server/server')(config,socketServer);
var webSocketServer =require('./web_socket_server/server')(config,webServer);


//Listening on...
var publicAddress = require('public-address');
console.log(`Listening on ...`);
publicAddress(function(err,data){
    console.log(`WEBADMIN is running on ${data.address}:${config.default_web_admin_port} and 127.0.0.1:${config.default_web_admin_port}`);
    console.log(`SOCKETSERVER is running on ${data.address}:${config.default_socket_server_port} and 127.0.0.1:${config.default_socket_server_port}`);
});

