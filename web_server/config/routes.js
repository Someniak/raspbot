var auth = require('../utilities/auth');

module.exports = function (app,socketServer) {
    app.get('/', function(req, res,next) {
        res.render('login');
    });

    app.post('/login', function(req,res,next){
        auth.login(req,res);
        res.redirect('overview');
    });


    app.get('/overview', auth.requireToken,function(req,res,next){
        let connections = socketServer.getAllConnections();
        res.render('overview',{
            connections: connections
        });
    });

    app.get('*', function(req,res,next){
        res.status(404).render('404');
    });
};
