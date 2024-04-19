import {Schema, model, models} from 'mongoose';

const userSchema = new Schema({
email: {
    type: String,
    unique: true,
    required: [true, "Correo electrónico requerido"],
    match: [
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
        "Correo electrónico inválido"
    ]
},
password: {
    type: String,
    required: [true, "Contraseña requerida"],
    select: false//para que no lo devuelva al hacer select
},
username: {
    type: String,
    required: [true, "Nombre de usuario requerido"],
    minLength: [3, "Longitud mínima nombre de usuario 3"],
    maxLength: [512, "Longitud máxima nombre de usuario 512"]
},
followers: [{
    type: Schema.Types.ObjectId,
    ref: "User"
}],
});

const User = models.User || model('User', userSchema);
export default User