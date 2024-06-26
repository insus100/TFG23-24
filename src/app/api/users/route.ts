import {  NextResponse } from "next/server";
import { connectDB } from "@/libs/mongodb";
import User from "@/models/user";

export async function POST(request: Request) {

}

export async function GET(request: Request) {
    await connectDB();
    const users = await User.find().populate(['username','email','followers']);
    return NextResponse.json(users);//esto saca todos.;
}

