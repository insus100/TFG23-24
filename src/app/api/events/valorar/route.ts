import { connectDB } from "@/libs/mongodb";
import Event from "@/models/event";
import {  NextResponse } from "next/server";

export async function POST(request: Request){

     const { rating, userId, _id } = await request.json();
  
    // Validaciones adicionales, si es necesario
  
    await connectDB();
    try {
        const event = await Event.findById(_id);
        if(event) {//si existe el evento.
            const existingRatingIndex: number = event.ratings.findIndex((c: any) => c.user.toString() === userId);
            
            // Si el usuario ya ha valorado, actualiza la valoracion
            if (existingRatingIndex !== -1) {
                event.ratings[existingRatingIndex].rating = rating;
            } else {
                event.ratings.push({ user: userId, rating });
            }

            // Guardar los cambios en el evento
            await event.save();
            return NextResponse.json({ status: 'ok', rating: rating });
        }
        
        return NextResponse.json({ status: 'notok'}, {status:400});
    } catch (error) {
        console.log(error);
        if (error instanceof Error)
            return NextResponse.json({ message: error?.message }, { status: 400 });
    }
  };