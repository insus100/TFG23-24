import {  NextRequest, NextResponse } from "next/server";
import User from "@/models/user";
import { connectDB } from "@/libs/mongodb";


export async function POST(request: Request) {
    const { _id, eventId, date, eliminar } = await request.json();

    await connectDB();
    console.log("recordatorio", _id, eventId, date, eliminar);
    try {
        if(eliminar) {
            const user = await User.findById(_id);
            if(user.eventReminders && user.eventReminders.length > 0) {
                const index = user.eventReminders.findIndex((r: any) => r.reminder.toISOString() == date);
                if(index != -1) {
                    user.eventReminders.splice(index, 1);
                    await user.save();
                    return NextResponse.json({status: 'ok'});
                }
            }
            return NextResponse.json({status: 'not deleted because it doesn\'t exist'});
        } else {     
            const user = await User.findById(_id);
            if(!user.eventReminders) user.eventReminders = [];
            if(!user.eventReminders.find((r: any) => r.reminder.toISOString() == date)) {
                user.eventReminders.push({
                    event: eventId,
                    reminder: date
                });
                await user.save();
            } else {
                console.log("El recordatorio ya existe!!!!")
            }
            
            return NextResponse.json({status: 'ok', date: date});
        }
    } catch (error) {
        console.log(error);
        if(error instanceof Error)
            return NextResponse.json({message: error?.message}, {status: 400})
    }
}


export async function GET(request: NextRequest) {
    //console.log("recordatorio GET request", request.nextUrl.searchParams)
    await connectDB();
    const recordatorios = await User.findById(request.nextUrl.searchParams.get('userId')).select('eventReminders')
    //console.log("GET RECORDATORIOS ", recordatorios)
    return NextResponse.json(recordatorios);
}