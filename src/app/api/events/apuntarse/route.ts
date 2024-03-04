import {  NextResponse } from "next/server";
import Event from "@/models/event";
import { connectDB } from "@/libs/mongodb";


export async function POST(request: Request) {
    const { _id, userId } = await request.json();

    await connectDB();
    try {
        const event = await Event.findById(_id);
        console.log("apuntarse", event);
        if(!event.attendingUsers.includes(userId)) event.attendingUsers.push(userId);
        const savedEvent = await event.save();
        return NextResponse.json({status: 'ok', event: savedEvent});
    } catch (error) {
        console.log(error);
        if(error instanceof Error)
            return NextResponse.json({message: error?.message}, {status: 400})
    }
}