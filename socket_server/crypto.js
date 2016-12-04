var crypto = require('crypto');
var config = require('../config.json');
var encryptor = require('simple-encryptor')(config.encryption_key);


module.exports.decrypt = function(ciphertext){
    return ciphertext;

};

module.exports.encrypt = function(plaintext){
    return plaintext;
};