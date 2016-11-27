//Configuration
var config = require('./config.json');
var logger = require('./utils/logger');

//Basic socketserver
var socketServer =require('./socket_server/server')({port: config.default_socket_server_port,default_encoding: 'utf8'});


//Basic webserver
var express = require('express');
var app = module.exports = express();
var http = require('http');


require('./web_server/config/express')(app);
require('./web_server/config/routes')(app,socketServer);

//Setup app
http.createServer(app).listen(config.default_web_admin_port);



//Listening on...
var publicAddress = require('public-address');
console.log(`Listening on ...`);
publicAddress(function(err,data){
    console.log(`WEBADMIN is running on ${data.address}:${config.default_web_admin_port} and 127.0.0.1:${config.default_web_admin_port}`);
    console.log(`SOCKETSERVER is running on ${data.address}:${config.default_socket_server_port} and 127.0.0.1:${config.default_socket_server_port}`);
});