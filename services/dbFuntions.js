const db = require('../db');

function getRanking(){
    return new Promise((resolve, reject) => {
        let messages = [];
  
        try {                     
          const data = db.query_noParams(`SELECT Patrulla, Puntos FROM Ranking ORDER BY puntos DESC`);
          data.statusCode = 200;

          resolve(data);
            
        } catch (err) {
          console.error(err);
          let error = new Error(messages.join());
          error.statusCode = 500;
          error.message="Error al consultar la información."
          reject(error);
        }
      });
}

function getRankingPatrulla(patrulla){
    return new Promise((resolve, reject) => {
        let messages = [];
  
        try {                     
          const data = db.query(`SELECT Patrulla, Puntos FROM Ranking WHERE patrulla = ?`, [patrulla]);
          data.statusCode = 200;

          resolve(data);
            
        } catch (err) {
          console.error(err);
          let error = new Error(messages.join());
          error.statusCode = 500;
          error.message="Error al consultar la información."
          reject(error);
        }
      });
}

function addPoints(id, total){
  return new Promise((resolve, reject) => {
      try {
          const result = db.run(`UPDATE Ranking SET puntos = ? WHERE patrulla = ?`, [total, id]);

          let message = 'Error al actualizar el registro.';
          
          if (result.changes) {
            message = 'Registro actualizado correctamente.';
          } else {
            let error = new Error();
            error.statusCode = 404;
            error.message='addPoints error.';
            reject(error);
          } 
    
          resolve(message);
            
        } catch (err) {
          console.error(err);
          let error = new Error();
          error.statusCode = 500;
          error.message='Se ha producido un error durante la actualización del registro.';
          reject(error);
      }
  });
}

function getPoints(patrulla){
  return new Promise((resolve, reject) => {
    let messages = [];
    
    try {          
      const data = db.query(`SELECT Puntos FROM Ranking WHERE Patrulla = ?`, [patrulla]);
      resolve(data);            
    } catch (err) {
      console.error(err);
      let error = new Error(messages.join());
      error.statusCode = 500;
      error.message="Error al consultar la información."
      reject(error);
    }
  });
}


/**
 * Login
 */

 function doLogin(username, bAuth){
  return new Promise((resolve, reject) => {
    let messages = [];
    let password = bAuth.split(" ")[1];

    try {          
      const data = db.query(`SELECT username, isAdmin FROM Login WHERE username = ? AND password = ?`, [username, password]);
      
      if (data && data.length > 0) {
        resolve(data);
      } else {
        resolve(401);
      }
      
    } catch (err) {
      console.error(err);
      let error = new Error(messages.join());
      error.statusCode = 500;
      error.message="Error al consultar la información."
      reject(error);
    }
  });
 }

 /**
  * Sc
  */

 function getCenso(){
  return new Promise((resolve, reject) => {
      let messages = [];

      try {                     
        const data = db.query_noParams(`SELECT nombre, totem, (SELECT nombre FROM adm_etapas WHERE id = etapa) as etapa, anio, patrulla FROM adm_censo GROUP BY patrulla`);
        data.statusCode = 200;
        resolve(data);
          
      } catch (err) {
        console.error(err);
        let error = new Error(messages.join());
        error.statusCode = 500;
        error.message="Error al consultar la información."
        reject(error);
      }
    });
}


function updateTable(payload){
  return new Promise((resolve, reject) => {
    try {
      let queryParams = [];
      let sql = ``;
      let firstLoop = true;
      
      for(var key in payload.params){
        queryParams.push(payload.params[key]);
        
        if (firstLoop) {
          sql = `UPDATE ${payload.table} SET ${key} = ?`
          firstLoop = false;
        }else{
          sql += `, ${key} = ?`
        }        
      }
      
      let response = { message: 'Error al actualizar el registro.', statusCode: '400' };
      if (!payload.filter){
        resolve(response);
      }
      
      sql += ` WHERE idCenso = ${payload.filter}`
      
      const result = db.run(sql, queryParams);
      
      if (result.changes) {
        response.message = 'Registro actualizado correctamente.';
        response.statusCode = 200;
      } else {
        let error = new Error();
        error.statusCode = 404;
        error.message='Recurso no encontrado.';
        reject(error);
      } 
      
      resolve(response);
      
    } catch (err) {
      console.error(err);
      let error = new Error();
      error.statusCode = 500;
      error.message='Se ha producido un error durante la actualización del registro.';
      reject(error);
    }
  });
}

function getTable(payload){
  return new Promise((resolve, reject) => {
    let table = payload.table

    if (!table || table == undefined || table == "Login"){
      let response = { message: 'No se pudo encontrar la tabla especificada.', statusCode: 404 };
      resolve(response);
    } 

    try {                     
      const data = db.query_noParams(`SELECT * FROM ${table}`);
      data.statusCode = 200;
      resolve(data);
        
    } catch (err) {
      console.error(err);
      let response = { message: 'Error interno del servidor.', statusCode: 500 };
      reject(response);
    }
  });
}

module.exports = {
  getRanking,
  getRankingPatrulla,
  addPoints,
  getPoints,
  doLogin,
  getCenso,
  updateTable,
    getTable
}