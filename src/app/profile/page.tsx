"use client"
import { signOut, useSession} from 'next-auth/react';
import { useState } from 'react';
import axios, { AxiosError } from "axios";


function ProfilePage(){
    //const _status = await getServerSession(authOptions)
    const{data: session, status} = useSession()

    const user = session?.user as any;
    if(status === 'unauthenticated') {
        console.log("redirect to register");
        //return redirect('/login');
    }

    const [newPassword, setNewPassword] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [newEmail, setNewEmail] = useState('');
  
const handleChangePassword = async () => {
    // Implementa la lógica para cambiar la contraseña utilizando la API de NextAuth
    const response = await axios.post('/api/auth/passwordChange', {
      password: newPassword,
    });
    if (response.status == 200) {
      console.log('Contraseña actualizada con éxito');
    } else {
      console.error('Error al actualizar la contraseña');
    }
  };
  
  const handleChangeUsername = async () => {
    // Implementa la lógica para cambiar la contraseña utilizando la API de NextAuth
    const response = await axios.post('/api/auth/usernameChange', {
      username: newUsername,
    });
    if (response.status == 200) {
      console.log('Nombre de usuario actualizado con éxito');
    } else {
      console.error('Error al actualizar el nombre de usuario');
    }
  };

  const handleChangeEmail = async () => {
    // Implementa la lógica para cambiar la contraseña utilizando la API de NextAuth
    const response = await axios.post('/api/auth/emailChange', {
      email: newEmail,
    });
    if (response.status == 200) {
      console.log('Email actualizado con éxito');
    } else {
      console.error('Error al actualizar el email');
    }
  };

  return (
    <div>
      <button className="bg-red-500 text-white px-4 py-2 block" onClick={() => {signOut()}}>Cerrar sesión</button>
      <button id="profileButton" onClick={() => {irADashboard()}}>Ir al dashboard</button>
      <h1>Perfil de Usuario</h1>
      {session ? (
        <>
          <div>
            <label>Email Actual:</label>
            <p>{user.email}</p>
          </div>
          <div>
            <label>Cambiar Email:  </label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
            <button onClick={handleChangeEmail}>Guardar Nuevo Email</button>
          </div>
          <div>
            <label>Nombre de Usuario Actual:</label>
            <p>{user.username}</p>
          </div>
          <div>
            <label>Cambiar Nombre de Usuario:  </label>
            <input
              type="username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />
            <button onClick={handleChangeUsername}>Guardar Nuevo Usuario</button>
          </div>
          <div>
            <label>Cambiar Contraseña:  </label>
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

function irADashboard() {
  window.location.href = '/dashboard'; 
}

export default ProfilePage