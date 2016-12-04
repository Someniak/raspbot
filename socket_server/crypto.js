var crypto = require('crypto');
var config = require('../config.json');
var encryptor = require('simple-encryptor')(config.encryption_key);


var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = config.encryption_key;

module.exports.encrypt = function(text){
    var cipher = crypto.createCipher(algorithm,password)
    var crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
};

module.exports.decrypt = function(text){
    var decipher = crypto.createDecipher(algorithm,password)
    var dec = decipher.update(text,'hex','utf8')
    dec += decipher.final('utf8');
    return dec;
};