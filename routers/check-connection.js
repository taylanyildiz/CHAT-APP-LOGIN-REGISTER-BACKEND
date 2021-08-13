const controller = require('../controllers/check-connection-controller');

module.exports = (app)=>{
    const field = '/user';
    app.post(field+'/check-connection',controller.checkAccount);
}