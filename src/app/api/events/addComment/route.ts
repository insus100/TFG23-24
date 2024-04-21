import { connectDB } from "@/libs/mongodb";
import Event from "@/models/event";
import {  NextResponse } from "next/server";

export async function POST(request: Request){

     const { comment, _id, userId } = await request.json();
  
    await connectDB();
    try {
        let event = await Event.findById(_id);
        if(event) {//si existe el evento.
            event.comments.push({ user: userId, comment })
        }
        
        // Guardamos los cambios en el evento
        await event.save();
        event = await Event.findById(_id).populate(['comments.user']);
        return NextResponse.json({ status: 'ok', event: event });
    } catch (error) {
        console.log(error);
        if (error instanceof Error)
            return NextResponse.json({ message: error?.message }, { status: 400 });
    }
  };