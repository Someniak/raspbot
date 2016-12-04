var config = require('../../config.json');


module.exports = (function () {
    var token = config.token;

    var requireToken = function (req, res, next) {
        if (req.session && req.session.authenticated) {
            next();
        } else {
            res.status(403).render('status/403');
        }
    };

    var login = function(req,res,next){
        if(req.session && token === req.body.token){
            req.session.authenticated = true;
        }
    };
    var logout = function(req,res,next){
        if(req.session && req.session.authenticated) {
            req.session.authenticated = false;
        }
        res.redirect('/')
    };
    var isAuthenticated = function(req,res){
        return req.session && req.session.authenticated;
    };

    return {
        requireToken: requireToken,
        login: login,
        logout: logout,
        isAuthenticated: isAuthenticated
    }
})();