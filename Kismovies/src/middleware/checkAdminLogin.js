var sessionstorage = require('sessionstorage');
module.exports = (req, res, next) => {
    // next();

    if(!sessionstorage.getItem('user')) {
        res.redirect('/be-admin/login')
    }else {
        next();
    }
  };
  