const mongoose = require('mongoose');
//plugin de mongo se utiliza para que no inserte un campo repetido
const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
	values: ['ADMIN_ROLE','USER_ROLE'],
	message: '{VALUE} no es un rol valido'

};

let Schema = mongoose.Schema;


// Aqui se crea un nuevo esquema
let usuarioSchema = new Schema({
	nombre: {
		type: String,
		required: [true, 'El nombre es necesario']
	},
	email: {
		type: String,
		unique: true,
		required: [true, 'El correo es necesario']
	},
	password: {
		type: String,
		required: [true, 'la clave es obligatoria']
	},
	img: {
		type: String,
		required: false
	},
	
	role: {
		type: String,
		default:'USER_ROLE',
		enum:rolesValidos
	},
	estado: {
		type: Boolean,
		default: true
	},
	google: {
		type: Boolean,
		default: false
	},
});

// Aqui se ingresa al esquema para que no devuelva el objeto password en JSON esto es por seguridad
usuarioSchema.methods.toJSON = function (){
	let user = this;
	let userObject = user.toObject();
	delete userObject.password;
	return userObject;
}

// este es como un plugin validator de mongo se utiliza para que no inserte un campo repetido
usuarioSchema.plugin(uniqueValidator, {message: '{PATH} Debe de ser unico'});

module.exports = mongoose.model('Usuario', usuarioSchema);
