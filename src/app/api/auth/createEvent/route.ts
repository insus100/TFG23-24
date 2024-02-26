import {  NextResponse } from "next/server";
import Event from "@/models/event";
import { connectDB } from "@/libs/mongodb";
export async function POST(request: Request) {
    //const body = await request.json();
    //console.log(body);
    const {title, start, end } = await request.json();

    await connectDB();

    try {
        const event = new Event({
            title,
            start,
            end
        })
        const savedEvent = await event.save();
        console.log(savedEvent)
        return NextResponse.json({
            _id: savedEvent._id
        });
    } catch (error) {
        console.log(error);
        if(error instanceof Error)
            return NextResponse.json({message: error?.message}, {status: 400})
    }
    
    
}