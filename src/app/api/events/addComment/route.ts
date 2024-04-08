import { connectDB } from "@/libs/mongodb";
import Event from "@/models/event";
import { user } from "@nextui-org/react";
import {  NextResponse } from "next/server";

export async function POST(request: Request){

     const { comment, rating, _id, userId } = await request.json();
  
    // Validaciones adicionales, si es necesario
  
    await connectDB();
    try {
        const event = await Event.findById(_id);
        
        // Buscar si ya existe un comentario del usuario
        const existingCommentIndex: number = event.comments.findIndex((c: any) => c.user.toString() === userId);
        
        // Si el usuario ya ha comentado, actualiza el comentario existente
        if (existingCommentIndex !== -1) {
            event.comments[existingCommentIndex].comment = comment;
            event.comments[existingCommentIndex].rating = rating;
        } else {
            // Si no existe un comentario del usuario, añade uno nuevo
            event.comments.push({ user: userId, comment, rating });
        }
        
        // Guardar los cambios en el evento
        const savedEvent = await event.save();
        
        return NextResponse.json({ status: 'ok', event: savedEvent });
    } catch (error) {
        console.log(error);
        if (error instanceof Error)
            return NextResponse.json({ message: error?.message }, { status: 400 });
    }
  };