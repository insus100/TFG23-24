import { connectDB } from "@/libs/mongodb";
import Event from "@/models/event";
import {  NextResponse } from "next/server";

export async function POST(request: Request){

     const { comment, _id, userId } = await request.json();
  
    // Validaciones adicionales, si es necesario
  
    await connectDB();
    try {
        let event = await Event.findById(_id);
        if(event) {//si existe el evento.
            event.comments.push({ user: userId, comment })
        }
        
        //los comentarios siempre los añade- Se puede añadir un boton de editar al lado del input del usuario.
        /*// Buscar si ya existe un comentario del usuario
        const existingCommentIndex: number = event.comments.findIndex((c: any) => c.user.toString() === userId);
        
        // Si el usuario ya ha comentado, actualiza el comentario existente
        if (existingCommentIndex !== -1) {
            event.comments[existingCommentIndex].comment = comment;
            //event.comments[existingCommentIndex].rating = rating;
        } else {
            // Si no existe un comentario del usuario, añade uno nuevo
            event.comments.push({ user: userId, comment, rating });
        }*/
        
        // Guardar los cambios en el evento
        await event.save();
        event = await Event.findById(_id).populate(['comments.user']);
        return NextResponse.json({ status: 'ok', event: event });
    } catch (error) {
        console.log(error);
        if (error instanceof Error)
            return NextResponse.json({ message: error?.message }, { status: 400 });
    }
  };