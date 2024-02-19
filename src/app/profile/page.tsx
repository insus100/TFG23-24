"use client"
import {useSession} from 'next-auth/react'
import { useState } from 'react';



function ProfilePage(){
    //const _status = await getServerSession(authOptions)
    const{data: session, status} = useSession()

    console.log(`session:`, session, `\nstatus:`, status);
    if(status === 'unauthenticated') {
        console.log("redirect to register");
        //return redirect('/login');
    }

    const [newPassword, setNewPassword] = useState('');
  
const handleChangePassword = async () => {
    // Implementa la lógica para cambiar la contraseña utilizando la API de NextAuth
    const response = await fetch('/api/auth/password/change', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newPassword }),
    });

    if (response.ok) {
      console.log('Contraseña actualizada con éxito');
    } else {
      console.error('Error al actualizar la contraseña');
    }
  };

  return (
    <div>
      <h1>Perfil de Usuario</h1>
      {session ? (
        <>
          <div>
            <label>Email:</label>
            <p>{session.user?.email}</p>
          </div>
          <div>
            <label>Nueva Contraseña:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button onClick={handleChangePassword}>Guardar Nueva Contraseña</button>
          </div>
        </>
      ) : (
        <p>Debes iniciar sesión para ver tu perfil.</p>
      )}
    </div>
    )
}


export default ProfilePage