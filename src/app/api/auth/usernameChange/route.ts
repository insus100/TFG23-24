import { connectDB } from "@/libs/mongodb";
import User from "@/models/user";
import {  NextResponse } from "next/server";

export async function POST(request: Request){

     const { username, curEmail } = await request.json();
  
    // Validaciones adicionales, si es necesario
  
    try {
        await connectDB();
  
      // Obtén el usuario desde la base de datos
      //const session = await getServerSession();
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
  
  
      // Actualiza la contraseña del usuario en la base de datos
      user.username = username;
      await user.save();
  
      return NextResponse.json(
        {
            message: "Nombre de usuario actualizado con éxito"
        },
        {
            status: 200
        })
    } catch (error) {
      console.error('Error al cambiar el nombre de usuario:', error);
      return NextResponse.json(
        {
            message: "Error interno del servidor " + error
        },
        {
            status: 500
        })
    }
  };