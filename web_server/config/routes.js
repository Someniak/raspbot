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
    app.get('/control/:id', auth.requireToken,function(req,res,next){
        connection = socketServer.getConnectionById(req.params.id);
        res.render('control',{
            connection : connection
        });

    });
    app.post('/control/:id/cmd/',auth.requireToken, function(req,res,next){
        let cmd =req.body.cmd;
        let id =req.params.id;
        socketServer.sendCmd(id,cmd);

        res.redirect('/control/'+id);
    });

    app.post('/control/:id/sig/',auth.requireToken, function(req,res,next){
        let sig =req.body.sig;
        let id =req.params.id;
        socketServer.sendSig(id,sig);

        res.redirect('/control/'+id);
    });

    app.get('*', function(req,res,next){
        res.status(404).render('status/404');
    });
};
