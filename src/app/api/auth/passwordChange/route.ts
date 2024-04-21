import { connectDB } from "@/libs/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import {  NextResponse } from "next/server";

export async function POST(request: Request){

     const { password, curEmail } = await request.json();
  
    if(password.length < 4) {
        return NextResponse.json(
            {
                message: "La longitud mínima de la contraseña es 4 caracteres"
            },
            {
                status: 500
            })
    }
    try {
        await connectDB();
  
      // Obtenemos el usuario desde la base de datos
      const user = await User.findOne({email: curEmail});
  
      if (!user) {
        return NextResponse.json(
          {
              message: "Usuario no encontrado"
          },
          {
              status: 404
          })
  
      }
  
      // Hasheamos la nueva contraseña antes de almacenarla
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Actualizamos la contraseña del usuario en la base de datos
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
            message: "Error interno del servidor " + error
        },
        {
            status: 500
        })
    }
  };