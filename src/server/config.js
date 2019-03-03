const path = require('path');
const morgan = require('morgan');
const express = require('express');
var cookieParser = require('cookie-parser');
const exphbs  = require('express-handlebars');
const cors = require('cors');


const routes = require('../routes');

module.exports = app => {

  // Settings
  app.set('port', process.env.PORT || 3000);

  //config to template//
  app.set('views', path.join(__dirname, '../views'));
  app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    extname: '.hbs'
  }));
  app.set('view engine', '.hbs')

  // middlewares
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  app.use(morgan('dev'));
  app.use(express.urlencoded({extended: true}));
  app.use(express.json());
  app.use(cors());
  app.use(cookieParser('heider1632'))

  // Routes
  routes(app);

  // Static files
  app.use('/public', express.static(path.join(__dirname, '../public')));


  return app;

};
