const helpers = {};

helpers.isAuthenticated = (req, res, next) => {
  if (req.signedCookies.user){
    return next();
  }
  res.redirect('/login');
};

module.exports = helpers;
