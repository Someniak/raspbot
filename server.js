let config = require('./config.json');
//var logger = require('./utils/logger');

let express = require('express');
let app = module.exports = express();
let http = require('http');
let server = http.createServer(app).listen(config.default_web_admin_port);

let websocket =require('./web_socket/server')(server);
let socketServer =require('./socket_server/server')({port: config.default_socket_server_port,default_encoding: 'utf8'},websocket);

require('./web_server/config/express')(app);
require('./web_server/config/routes')(app,socketServer);


let publicAddress = require('public-address');
console.log(`Listening on ...`);
publicAddress(function(err,data){
    if(data){

        console.log(`WEBADMIN is running on ${data.address}:${config.default_web_admin_port} and 127.0.0.1:${config.default_web_admin_port}`);
        console.log(`SOCKETSERVER is running on ${data.address}:${config.default_socket_server_port} and 127.0.0.1:${config.default_socket_server_port}`);
    }
});
