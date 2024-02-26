import {  NextResponse } from "next/server";
import Event from "@/models/event";
import { connectDB } from "@/libs/mongodb";
export async function POST(request: Request) {
    const { title, start, end, creator } = await request.json();

    await connectDB();
    try {
        const event = new Event({
            title,
            start,
            end,
            creator,
            attendingUsers: []
        })
        const savedEvent = await event.save();
        console.log("createEvent", savedEvent)
        return NextResponse.json({status: 'ok', event: savedEvent});
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
    const events = await Event.find();//esto saca todos.
    return NextResponse.json(events);
}