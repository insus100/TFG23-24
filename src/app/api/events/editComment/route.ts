import { connectDB } from "@/libs/mongodb";
import Event from "@/models/event";
import { NextResponse } from "next/server";

export async function POST(request: Request){

  const { commentId, newText } = await request.json();
  
  try {
    await connectDB();
  
    // Buscamos el evento que contiene el comentario
    const event = await Event.findOne({ "comments._id": commentId });
  
    if (!event) {
      console.log('Evento no encontrado');
      return NextResponse.json({
        message: "Evento no encontrado"
      }, {
        status: 404
      });
    }
  
    console.log('Event:', event);
  
    // Encontramos el comentario específico dentro del evento
    const comment = event.comments.find((comment: any) => comment._id.toString() === commentId);
  
    if (!comment) {
      console.log('Comentario no encontrado');
      return NextResponse.json({
        message: "Comentario no encontrado en el evento"
      }, {
        status: 404
      });
    }
  
    console.log('Comentario encontrado:', comment);
  
    // Actualizamos el texto del comentario
    comment.comment = newText;
  
    // Guardamos el evento actualizado
    await event.save();
  
    return NextResponse.json({
      message: "Comentario actualizado con éxito"
    }, {
      status: 200
    });
  } catch (error) {
    console.error('Error al editar el comentario:', error);
    return NextResponse.json({
      message: "Error interno del servidor"
    }, {
      status: 500
    });
  }
}
