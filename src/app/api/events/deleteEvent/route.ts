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


