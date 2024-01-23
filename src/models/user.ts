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
    minLength: [4, "Longitud mínima nombre de usuario 4"],
    maxLength: [128, "Longitud máxima nombre de usuario 128"]
}
});

const User = models.User || model('User', userSchema);
export default User