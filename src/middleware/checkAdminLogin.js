var sessionstorage = require('sessionstorage');
module.exports = (req, res, next) => {
    if(!sessionstorage.getItem('user')) {
        res.redirect('/be-admin/login')
    }else {
        next();
    }
  };
  