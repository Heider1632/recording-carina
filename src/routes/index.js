const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const upload = multer();

// Controllers
const home = require('../controllers/home');
const login = require('../controllers/login');

// Helpers
const {
  isAuthenticated
} = require('../helpers/auth');

module.exports = app => {

  router.get('/', isAuthenticated, home.index);
  router.post('/traducir', isAuthenticated, home.translate)
  router.post('/subir', upload.single('soundBlob'), (req, res, next) => {
    //console.log(req.file); // see what got uploaded
    
    let uploadLocation = path.join(__dirname, '../public/uploads/') + req.file.originalname// where to save the file to. make sure the incoming name has a .wav extension

    fs.writeFileSync(uploadLocation, Buffer.from(new Uint8Array(req.file.buffer))); // write the blob to the server as a file
    res.sendStatus(200); //send back that everything went ok

    
  });
  router.get('/login', login.index);
  router.post('/login', login.login)

  app.use(router);

};