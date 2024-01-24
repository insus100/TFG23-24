import {  NextResponse } from "next/server";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import { connectDB } from "@/libs/mongodb";
export async function POST(request: Request) {
    //const body = await request.json();
    //console.log(body);
    const {username, email, pwd } = await request.json();
    if(!pwd || pwd.length < 4) return NextResponse.json({
        message: "La contraseña debe tener al menos 4 caracteres"
    }, {
        status: 400
    });
    await connectDB();
    const exists = await User.findOne({email: email})//acceso a la base de datos, saca un usuario con email: email, si no existe es undefined
    if(exists) {
        return NextResponse.json(
        {
            message: "El correo ya existe."
        },
        {
            status: 409
        })
    }
    try {
        const password = await bcrypt.hash(pwd, 12);//hasheamos la contraseña
        const user = new User({
            email,
            username,
            password
        })
        const savedUser = await user.save();
        console.log(savedUser)
        return NextResponse.json({
            _id: savedUser._id,
            email: savedUser.email
        });
    } catch (error) {
        console.log(error);
        if(error instanceof Error)
            return NextResponse.json({message: error?.message}, {status: 400})
    }
    
    
}