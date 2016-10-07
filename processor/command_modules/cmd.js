//CMD MODULE boilerplate
module.exports = function(){
    var execute = function(data){
        return new Promise((resolve,reject) => {
            resolve(data);
        });
    };

    return {
        execute : execute
    }
};