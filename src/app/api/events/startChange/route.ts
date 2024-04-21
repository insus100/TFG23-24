import { connectDB } from "@/libs/mongodb";
import Event from "@/models/event";
import {  NextResponse } from "next/server";

export async function POST(request: Request){

     const { start, curTitle } = await request.json();
  
    try {
        await connectDB();
  

      const event = await Event.findOne({title: curTitle});
  
      if (!event) {
        return NextResponse.json(
          {
              message: "Evento no encontrado"
          },
          {
              status: 404
          })
  
      }
  
      event.start = start;
      await event.save();
  
      return NextResponse.json(
        {
            message: "Evento actualizado con éxito"
        },
        {
            status: 200
        })
    } catch (error) {
      console.error('Error al cambiar el comienzo del evento:', error);
      return NextResponse.json(
        {
            message: "Error interno del servidor"
        },
        {
            status: 500
        })
    }
  };