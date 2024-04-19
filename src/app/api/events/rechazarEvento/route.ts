import {  NextResponse } from "next/server";
import Event from "@/models/event";
import { connectDB } from "@/libs/mongodb";


export async function POST(request: Request) {
    const { _id, userId } = await request.json();

    await connectDB();
    try {
        const event = await Event.findById(_id);
        console.log("agregar rechazado", event);
        if(!event.rejectedBy.includes(userId)) event.rejectedBy.push(userId);
        const savedEvent = await event.save();
        return NextResponse.json({status: 'ok', event: savedEvent});
    } catch (error) {
        console.log(error);
        if(error instanceof Error)
            return NextResponse.json({message: error?.message}, {status: 400})
    }
}