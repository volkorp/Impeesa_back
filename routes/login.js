const app = require('express');
const router = app.Router();
const dbFunctions = require('../services/dbFuntions');
const tokenService = require('../services/token')

router.post('/:username/login', function(req, res) {
    var username = req.params.username;
    var bAuth = req.headers.authorization;

    console.log(username + ' ' + bAuth);

    if (!username || !bAuth){
        res.status(403);
    }

    dbFunctions.doLogin(username, bAuth).then(resultado => {
        if (resultado && resultado != 401){            
            var token = tokenService.generateToken(resultado[0].username, resultado[0].isAdmin);
            res.json({'token': token});
        } else {
            res.sendStatus(401);
        }
    }, err => {
        console.error(`[Error] - Haciendo login.`);
        res.status(err.statusCode).json(err);
        res.sendStatus(500);
    });

});

module.exports =  router;