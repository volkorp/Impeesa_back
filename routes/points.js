const app = require('express');
const router = app.Router();
const dbFunctions = require('../services/dbFuntions');
const tokenService = require('../services/token')


router.get('/getRanking', function(req, res){    
    var token = req.headers.authorization;
    // res.set('Access-Control-Allow-Origin', 'http://localhost:4200');

    // tokenService.verifyToken(token, false).then(valid => {        
    //     return valid;
    // }).then(valid => {      
    //   if (!valid ) { 
    //     res.sendStatus(403)
    //   } else {
        dbFunctions.getRanking().then(resultado => {
          if(resultado && resultado.statusCode){
              res.status(resultado.statusCode).json(resultado);
          }
        }, err =>{
            console.error(`Error durante consulta `, err.message);         
            res.status(err.statusCode).json(err);
        });
    //   }
    // });
});

router.get('/:patrulla/getRanking', function(req, res){
  var patrulla = req.params.patrulla;
  var token = req.headers.authorization;

  tokenService.verifyToken(token, false).then(valid => {        
      return valid;
  }).then(valid => {
    if (!valid ) { 
      res.sendStatus(403)
    } else {
      dbFunctions.getRankingPatrulla(patrulla).then(resultado => {
        if(resultado && resultado.statusCode){
            res.status(resultado.statusCode).json(resultado);
        }
      }, err =>{
          console.error(`Error durante consulta `, err.message);         
          res.status(err.statusCode).json(err);
      });
    }
  });  
});

router.put('/:patrulla/:points/sumaPuntos', function(req, res) {
  var patrulla = req.params.patrulla;
  var points = req.params.points;
  var token = req.headers.authorization;
  var total = 0;

  tokenService.verifyToken(token, true).then(valid => {        
      return valid;
  }).then(valid => {
    if (!valid ) { 
      res.sendStatus(403)
    } else {
      dbFunctions.getPoints(patrulla).then(resultado => {        
        return resultado;
      }, err =>{
        console.error(`[Error] - Recuperando los puntos: `, err.message);       
        res.status(err.statusCode).json(err);
      }).then(data => {       
         
        if (data[0] && data[0].Puntos != undefined){
          total = parseInt(data[0].Puntos) + parseInt(points);
        }else{
          throw new Error('[Error] - Formato de puntos no válidos.')
        }      
  
        dbFunctions.addPoints(patrulla, total).then(resultado => {
          if (resultado && resultado.statusCode) {      
            res.status(resultado.statusCode).json(resultado);
          }else if(resultado){      
              res.json(resultado);
          }
        }, err =>{
          console.error(`[Error] Añadiendo los puntos: `, err.message);       
          res.status(err.statusCode).json(err);
        });
      }, err => {
        console.error(err.message);
        res.status(err.statusCode).json(err);
      });
    } 
  });
});

module.exports =  router;