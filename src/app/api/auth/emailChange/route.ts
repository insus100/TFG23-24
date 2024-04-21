import { connectDB } from "@/libs/mongodb";
import User from "@/models/user";
import {  NextResponse } from "next/server";

export async function POST(request: Request){

     const { email, curEmail } = await request.json();
  
    try {
        await connectDB();
  
      // Obtenemos el usuario desde la base de datos
      const user = await User.findOne({email: curEmail});
  
      if (!user) {
        return NextResponse.json(
          {
              message: `Usuario ${curEmail} no encontrado`
          },
          {
              status: 404
          })
  
      }
  
  
      // Actualizamos la contraseña del usuario en la base de datos
      user.email = email;
      await user.save();
  
      return NextResponse.json(
        {
            message: "E-mail actualizado con éxito"
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