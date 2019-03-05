const axios = require('axios');

const ctrl = {};

ctrl.index = (req, res) => {
  res.render('index', { title: 'Prueba echo recording' })
};


ctrl.translate = async (req, res) => {

  var datos = req.body.data;

  try {

    // axios.post('https://carinalab.co:3000/api/carinaligth/v1/inputText', datos)
    const response = await axios.post('https://echo-2018.appspot.com/api/carinaligth/v1/inputText', datos)
    // console.log(response)
    // console.log('Respuesta desde Carina: ', response)
    if (response.data.response.estado.codigo === 200) {
      // console.log('se llama a actualizarAnalisis')
      return response.data.response;
    } else {
      // console.log('se llama a actualizarAnalisisSinResultados')
      return res.sendStatus(404);
    }
   
  } catch (e) {
    console.error(e); // 💩
  }

};

module.exports = ctrl;
