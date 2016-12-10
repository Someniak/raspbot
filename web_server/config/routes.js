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

    app.post('/control/:id/cmd/',auth.requireToken,function(req,res,next){
        let id = req.params.id;
        let cmd = req.body.cmd;
        console.log(cmd);
        socketServer.sendCmd(id,cmd);
        res.status(200).send({'status':'ok'})
    });
    app.post('/control/broadcast-cmd/',auth.requireToken,function(req,res,next){
        console.log(req.body);
        let cmd = req.body.cmd;
        socketServer.broadcastCmd(cmd);
        res.status(200).send({'status':'ok'})
    });
};
