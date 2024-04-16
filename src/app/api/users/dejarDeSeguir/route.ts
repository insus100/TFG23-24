import {  NextResponse } from "next/server";
import User from "@/models/user";
import { connectDB } from "@/libs/mongodb";


export async function POST(request: Request) {
    const { _id, userId } = await request.json();

    await connectDB();
    try {
        const user = await User.findById(_id);
        user.followers.remove(userId);
        const savedUser = await user.save();
        return NextResponse.json({status: 'ok', user: savedUser});
    } catch (error) {
        console.log(error);
        if(error instanceof Error)
            return NextResponse.json({message: error?.message}, {status: 400})
    }
}