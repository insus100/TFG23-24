import {  NextResponse } from "next/server";
import Event from "@/models/event";
import { connectDB } from "@/libs/mongodb";

export async function POST(request: Request) {
    const { _id } = await request.json();

    await connectDB();
    try {
        const removeEvent = await Event.deleteOne({_id: _id})
        
        console.log("deletedEvent", removeEvent)
        return NextResponse.json({status: 'ok', event: _id});
    } catch (error) {
        console.log(error);
        if(error instanceof Error)
            return NextResponse.json({message: error?.message}, {status: 400})
    }
}

export async function GET(request: Request) {
    
    //aquí habría que sacar los eventos del mes y mandar solo los de un mes, no todos porque si no se petará en el caso que haya muchos eventos.
    //en la query especificar start y end
    //return NextResponse.json({});
    await connectDB();
    const events = await Event.find().populate(['creator', 'attendingUsers']);//esto saca todos.
    //console.log("Fetched events successfully:", events);
    return NextResponse.json(events);
}

