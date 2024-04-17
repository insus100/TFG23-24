"use client"
import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button, Input, Card, CardHeader, CardBody, CardFooter, Divider, Link, Image } from "@nextui-org/react";

function ProfilePage() {
  //const _status = await getServerSession(authOptions)
  const { data: session, status, update } = useSession()
  const router = useRouter();
  const user = session?.user as any;
  if (status === 'unauthenticated') {
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
      curEmail: user.email
    });
    if (response.status == 200) {
      console.log('Contraseña actualizada con éxito');
      update({ user: {...session?.user, password: 'hashearlaaa'} });
    } else {
      console.error('Error al actualizar la contraseña');
    }
  };

  const handleChangeUsername = async () => {
    // Implementa la lógica para cambiar la contraseña utilizando la API de NextAuth
    const response = await axios.post('/api/auth/usernameChange', {
      username: newUsername,
      curEmail: user.email
    });
    if (response.status == 200) {
      console.log('Nombre de usuario actualizado con éxito');
      update({ user: {...session?.user, username: newUsername} });
    } else {
      console.error('Error al actualizar el nombre de usuario');
    }
  };

  const handleChangeEmail = async () => {
    // Implementa la lógica para cambiar la contraseña utilizando la API de NextAuth
    const response = await axios.post('/api/auth/emailChange', {
      email: newEmail,
      curEmail: user.email
    });
    if (response.status == 200) {
      console.log('Email actualizado con éxito');
      //actualizar sesion.
      update({ user: {...session?.user, email: newEmail} });
    } else {
      console.error('Error al actualizar el email');
    }
  };

  const irADashboard = () => {
    return router.push('/dashboard')
  };

  return (
    <div>
      <Button color="danger" className="block mt-2 ml-2" onClick={() => { signOut() }}>
        Cerrar sesión
      </Button>
      <Button color="primary" id="profileButton" onPress={() => { irADashboard() }}>
        Ir al Dashboard
      </Button>
      {session ? (
        <>
          <div className='justify-center h-[calc(100vh-4rem)] flex items-center'>
            <Card className="w-[30rem]">
              <CardHeader className="flex gap-3">
                <Image
                  alt="Imagen de usuario"
                  height={40}
                  radius="sm"
                  src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
                  width={40}
                />
                <div className="flex flex-col">
                  <p className="text-md">{user.username}</p>
                  <p className="text-small text-default-500">Perfil de Usuario</p>
                </div>
              </CardHeader>
              <Divider />
              <CardBody>

                <Input
                  variant="bordered"
                  type="email"
                  label="Actualizar e-mail:"
                  placeholder="Actualizar e-mail"
                  name="email"
                  className="w-full"
                  defaultValue={user.email}
                  onChange={(e) => setNewEmail(e.target.value)}
                  style={{ color: 'white' }}
                />
                <Button color='primary' className='mt-1' onClick={handleChangeEmail}>Actualizar e-mail</Button>

                <Input
                  variant="bordered"
                  type="text"
                  label="Actualizar nombre de usuario:"
                  placeholder="Actualizar nombre de usuario"
                  name="username"
                  className="w-full mt-4"
                  defaultValue={user.username}
                  onChange={(e) => setNewUsername(e.target.value)}
                  style={{ color: 'white' }}
                />
                <Button color='primary' className='mt-1' onClick={handleChangeUsername}>Actualizar nombre de usuario</Button>

                <Input
                  variant="bordered"
                  type="password"
                  label="Actualizar contraseña:"
                  placeholder="Actualizar contraseña"
                  name="password"
                  className="w-full mt-4"
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{ color: 'white' }}
                />
                <Button color='primary' className='mt-1' onClick={handleChangePassword}>Actualizar contraseña</Button>

              </CardBody>
              <Divider />
              <CardFooter>
                <Link
                  isExternal
                  showAnchorIcon
                  href="https://github.com/nextui-org/nextui"
                >
                  Jecuta, jecuta.
                </Link>
              </CardFooter>
            </Card>
          </div>
        </>
      ) : <p>Debes iniciar sesión para ver tu perfil</p>}
      {/*session ? (
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
      )*/}
    </div>
  )
}

export default ProfilePage