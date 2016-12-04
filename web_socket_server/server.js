
module.exports = function(app){
    var io = require('socket.io')(app);

    io.on('connection', function (socket) {
        socket.emit('connection', { hello: 'world' });
        socket.on('my other event', function (data) {
            console.log(data);
        });
    });
};

