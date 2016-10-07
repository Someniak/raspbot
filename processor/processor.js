var normalizedPath = require("path").join(__dirname, "command_modules");

module.exports = function(){
    var execute = function(packet){
        var commands = [];
        var promises = [];

        for(var commandname in packet.data){
            commands.push(commandname);
        }

        require('fs').readdirSync(normalizedPath).forEach((file) => {
            let command = commands.indexOf(file);
            if(command >= 0)
            let module = require(`./modules/${file}`)(packet.data[command]);
            promises.push(module.execute(packet.data));
        });


        return Promise.all(promises);
    };

    return {
        execute:execute
    }
}();