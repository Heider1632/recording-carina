const firebase = require('firebase');

const ctrl = {}

ctrl.index = async (req, res) => {
  res.render('login')
};

ctrl.login = function (req, res) {

    let options = {
        maxAge: 60 * 60 * 24 * 7, // 1 week
        httpOnly: true, // The cookie only accessible by the web server
        signed: true // Indicates if the cookie should be signed
    }

  firebase.auth().signInWithEmailAndPassword(req.body.email, req.body.password)
  .then(user => {

    res.cookie('user', user, options);

    res.redirect('/');
  })
  .catch(err => {
    console.log(err);
    res.redirect('/login');
  })

};

module.exports = ctrl;
