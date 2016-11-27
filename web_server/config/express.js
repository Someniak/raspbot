var express = require('express'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    config = require('../../config.json'),
    expressValidator =require('express-validator'),
    path = require('path'),
    auth = require('../utilities/auth'),
    uuid = require('uuid-v4');

module.exports = function (app) {
    app.use(session({name: 'RaspbotToken', secret: uuid()}));
    app.set('views', path.join(__dirname,'../views'));
    app.set('view engine', 'ejs');
    app.use(logger(config.logmode));
    app.use(cookieParser());
    app.use(bodyParser());
    app.use(express.static(path.join(__dirname,'../www/')));

    app.use(expressValidator());

    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Methods', 'GET,POST');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Request-With, Content-Type, Accept');
        res.header('X-Frame-Options', 'deny');
        res.header('X-XSS-Protection', '1; mode=block');
        res.header('X-Powered-By', 'Raspbot');
        next();
    });
    app.use((req,res,next)=> {
        req.session.authenticated = true;
        next();
    })
};

