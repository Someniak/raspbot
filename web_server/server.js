var express = require('express');
var app = module.exports = express();
var http = require('http');
module.exports = function(config,socketServer){
    require('./config/express')(app);
    require('./config/routes')(app,socketServer);

//Setup app
    http.createServer(app).listen(config.default_web_admin_port);
    return app;
};