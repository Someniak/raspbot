module.exports = function (http) {
    if (typeof http === 'undefined') {
        throw new Error('Http is not defined!');
    }

    let io = require('socket.io').listen(http);

    let emit = function (emission) {
        let data = JSON.stringify(emission.data, function( key, value) {
            if( key == 'socket') { return null;}
            else {return value;}
        });
        io.sockets.emit(emission.type, data);
    };
    let registerListener = function (event, callback) {
        io.sockets.on(event,callback);
    };

    let send = function(type,data){
        emit({type: type, data:data});
    };
    return {
        registerListener: registerListener,
        send: send
    }
};
