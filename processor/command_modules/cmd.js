//CMD MODULE boilerplate
module.exports = function(){
    var execute = function(data){
        return new Promise((resolve,reject) => {
            resolve("CMD packet has been received");
        });
    };

    return {
        execute : execute
    }
};