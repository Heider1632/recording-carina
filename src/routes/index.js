const express = require('express');
const router = express.Router();

// Controllers
const home = require('../controllers/home');
const login = require('../controllers/login');

// Helpers
const { isAuthenticated } = require('../helpers/auth');

module.exports = app => {

  router.get('/', isAuthenticated, home.index);
  router.post('/traducir', isAuthenticated ,home.translate)
  router.post('/upload', isAuthenticated, home.upload);
  router.get('/login', login.index);
  router.post('/login', login.login)

  app.use(router);

};
