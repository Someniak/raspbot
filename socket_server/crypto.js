var CryptoJS = require('crypto-js');
var config = require('../config.json');

module.exports.decrypt = function(ciphertext){
    var bytes  = CryptoJS.AES.decrypt(ciphertext, config.encryption_key);
    return bytes.toString(CryptoJS.enc.Utf8);
};
module.exports.encrypt = function(plaintext){
    return CryptoJS.AES.encrypt(plaintext, config.encryption_key).toString();
};