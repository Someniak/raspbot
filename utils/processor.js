module.exports = function(){
    var execute = function(packet){
        return new Promise((resolve,reject) => {
            resolve('Great imperial power has been achieved!!!')
        });
        //read out packet and do some fun stuff
    };


    return {
        execute:execute
    }
}();