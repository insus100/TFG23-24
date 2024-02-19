import { connectDB } from "@/libs/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import {  NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function POST(request: Request){

     const { password } = await request.json();
  
    // Validaciones adicionales, si es necesario
  
    try {
        await connectDB();
  
      // Obtén el usuario desde la base de datos
      const session = await getServerSession();
      const user = await User.findOne({email: session?.user?.email});
  
      if (!user) {
        return NextResponse.json(
          {
              message: "Usuario no encontrado"
          },
          {
              status: 404
          })
  
      }
  
      // Hashea la nueva contraseña antes de almacenarla
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Actualiza la contraseña del usuario en la base de datos
      user.password = hashedPassword;
      await user.save();
  
      return NextResponse.json(
        {
            message: "Contraseña actualizada con éxito"
        },
        {
            status: 200
        })
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      return NextResponse.json(
        {
            message: "Error interno del servidor"
        },
        {
            status: 500
        })
    }
  };