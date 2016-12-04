var crypto = require('crypto');
var config = require('../config.json');

module.exports.decrypt = function(ciphertext){
    try {
        let cipher = crypto.createCipher('aes-256-cbc',config.encryption_key);
        let crypted = cipher.update(ciphertext,'utf8','hex');
        crypted += cipher.final('hex');
        return crypted;
    }catch(err){
        console.log(err);
    }

};

module.exports.encrypt = function(plaintext){
    try{
        let decipher = crypto.createDecipher('aes-256-cbc',config.encryption_key);
        let dec = decipher.update(plaintext,'hex','utf8');
        dec += decipher.final('utf8');
        return dec;
    }catch(err){
        console.log(err);
    }
};