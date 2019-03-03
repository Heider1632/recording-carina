const multer = require('multer');
const fs = require('fs');
const upload = multer();
const axios = require('axios');

const ctrl = {};

ctrl.index = (req, res) => {
  res.render('index', { title: 'Prueba echo recording' })
};

ctrl.upload = (req, res, next) => {

  //upload.single('soundBlob'), function(){}

  console.log("the file is" +  req.file.originalname);
  // console.log(req.file); // see what got uploaded

  //let uploadLocation = __dirname + '/public/uploads/' + req.file.originalname // where to save the file to. make sure the incoming name has a .wav extension

  //fs.writeFileSync(uploadLocation, Buffer.from(new Uint8Array(req.file.buffer))); // write the blob to the server as a file
  res.sendStatus(200); //send back that everything went ok

}

ctrl.translate = (req, res) => {

  var datos  = req.body.data;

  console.log(datos);

  // axios.post('https://carinalab.co:3000/api/carinaligth/v1/inputText', datos)
  axios.post('https://echo-2018.appspot.com/api/carinaligth/v1/inputText', {datos: datos})
    .then(response => {
      // console.log(response)
      if (response) {
        // console.log('Respuesta desde Carina: ', response)
        if (response.data.response.estado.codigo === 200) {
          // console.log('se llama a actualizarAnalisis')
          return response.data.response;
        } else {
          // console.log('se llama a actualizarAnalisisSinResultados')
          return res.sendStatus(404);
        }
      }
    })
    .catch(function (error) {
      console.log('algo no fue bien...' + error);
    })
};

module.exports = ctrl;
