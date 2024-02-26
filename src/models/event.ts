import {Schema, model, models} from 'mongoose';

const eventSchema = new Schema({
title: {
    type: String,
    required: [true, "Titulo del evento requerido"],
    minLength: [1, "Longitud mínima titulo del evento 1"],
    maxLength: [128, "Longitud máxima titulo del evento 128"]
},
start: {
    type: Date,
    required: [true, "Comienzo del evento requerido"]
},
end: {
    type: Date,
    required: [true, "Final del evento requerido"]
}
});

const Event = model('Event', eventSchema);
export default Event