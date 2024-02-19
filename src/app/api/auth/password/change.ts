import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { connectDB } from "@/libs/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req });
  
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
  
    const { newPassword } = req.body;
  
    // Validaciones adicionales, si es necesario
  
    try {
        await connectDB();
  
      // Obtén el usuario desde la base de datos
      const user = await User.findById(session.user?.email);
  
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
  
      // Hashea la nueva contraseña antes de almacenarla
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Actualiza la contraseña del usuario en la base de datos
      user.password = hashedPassword;
      await user.save();
  
      return res.status(200).json({ message: 'Contraseña actualizada con éxito' });
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  };