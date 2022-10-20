const app = require('express');
const router = app.Router();
const dbFunctions = require('../services/dbFuntions');
const tokenService = require('../services/token')

router.get('/getCenso', function(req, res){    
    var token = req.headers.authorization;

    tokenService.verifyToken(token, true).then(valid => {        
        return valid;
    }).then(valid => {      
      if (!valid) { 
        res.sendStatus(403)
      } else {
        dbFunctions.getCenso().then(resultado => {
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


router.post('/:table/:id/updateTable', function(req, res){    
    var token = req.headers.authorization;
    var payload = { table: req.params.table, params: req.query, filter: req.params.id};

    console.log(payload);
    
    tokenService.verifyToken(token, true).then(valid => {        
        return valid;
    }).then(valid => {      
      if (!valid) { 
        res.sendStatus(403)
      } else {
        dbFunctions.updateTable(payload).then(resultado => {
          if(resultado && resultado.statusCode){
              res.status(resultado.statusCode).json(resultado);
          }
        }, err =>{
            console.error(`[Error] - `, err.message);         
            res.status(err.statusCode).json(err);
        });
      }
    });
});

router.get('/:table/getTable', function(req, res){    
  var token = req.headers.authorization;
  var payload = { table: req.params.table };

  tokenService.verifyToken(token, true).then(valid => {        
      return valid;
  }).then(valid => {      
    if (!valid) { 
      res.sendStatus(403)
    } else {
      dbFunctions.getTable(payload).then(resultado => {
        if(resultado && resultado.statusCode){
            res.status(resultado.statusCode).json(resultado);
        }
      }, err =>{
          console.error(`[Error] `, err.message);          
          res.sendStatus(err.statusCode);
      });
    }
  });
});


module.exports =  router;