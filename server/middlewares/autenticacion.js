const jwt = require('jsonwebtoken');

// ============================
//  Verificar Token
// ============================

const { response } = require("../routes/login");

let verificaToken = (req, res, next) => {

	let token = req.get('token');

	jwt.verify(token, process.env.SEED, (err,decoded) => {

		if(err){
			return res.status(401).json({
				ok: false,
				err:{
					message: 'Token no valido'
				}
			});
		}

		req.usuario = decoded.usuario;
		next();
	});

	

}
// ============================
//  Verifica admin Role
// ============================
let verificaAdmin_Role = (req, res, next) => {

	let usuario = req.usuario;

	if(usuario.role === 'ADMIN_ROLE'){
		next();

	}else{
		return res.json({
			ok: false,
			err:{
				message: 'El usario no es administrador'
			}
	
		});

	}

	


};

module.exports = {
	verificaToken,
	verificaAdmin_Role
}