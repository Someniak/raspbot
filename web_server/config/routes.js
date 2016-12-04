var auth = require('../utilities/auth');

module.exports = function (app,socketServer) {
    app.get('/', function(req, res,next) {
        if (auth.isAuthenticated(req,res)) res.redirect('/overview');
        res.render('login');

    });
    app.post('/login', function(req,res,next){
        auth.login(req,res);
        res.redirect('overview');
    });
    app.post('/logout', auth.requireToken, function(req,res,next){
        auth.logout(req,res);
    });

    app.get('/overview', auth.requireToken,function(req,res,next){
        let connections = socketServer.getAllConnections();
        res.render('overview',{
            connections: connections
        });
    });
    app.get('/control/:id', auth.requireToken,function(req,res,next){
        connection = socketServer.getConnectionById(req.params.id);
        if(connection){
            res.render('control',{
                connection : connection
            });
        }else {
            res.redirect('/overview');
        }

    });
    app.get('*', function(req,res,next){
        res.status(404).render('status/404');
    });
};
