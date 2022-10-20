const jwt = require("jwt-simple");
const config = require('../config');
const moment = require("moment")

function verifyToken(token, needsAdmin){
    return new Promise((resolve, reject) => {
        if(!token) resolve(false);

        token = token.split(" ")[1];         
        
        try{
            var decoded = jwt.decode(token, config.secret, true);
            console.log(decoded);

            //False si requiere permisos de administrador que no tiene o está el token caducado.
            resolve(!(decoded.exp < moment().unix() || needsAdmin && (needsAdmin != decoded.admin)));
        }catch(e){
            resolve(false);
        }
    });
}

function generateToken(user, isAdmin){      
    return jwt.encode({ user: user, admin: isAdmin, exp: moment().add(24, 'hours').unix() }, config.secret);
};


module.exports = {
    verifyToken,
    generateToken
}