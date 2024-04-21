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
            attendingUsers: [],
            favorites: [],
            comments: [],
            ratings: [],
            recommendedBy: [],
            rejectedBy: []
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
    
    await connectDB();
    const events = await Event.find().populate(['creator', 'attendingUsers', 'favorites', 'comments.user', 'recommendedBy', 'rejectedBy']);//esto saca todos.
    return NextResponse.json(events);
}

