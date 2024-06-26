"use client"
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button, Input, Card, CardHeader, CardBody, CardFooter, Divider, Link, Image, Avatar } from "@nextui-org/react";
import MyNavbar from '../components/navbar';

function ProfilePage() {
  const { data: session, status, update } = useSession()
  const router = useRouter();
  const user = session?.user as any;
  if (status === 'unauthenticated') {
    console.log("redirect to register");
  }

  const [newPassword, setNewPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');

  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleChangePassword = async () => {
    setPasswordError("");
    try {
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
    } catch(err: any) {
      setPasswordError(err.response.data.message);
    }
    
  };

  const handleChangeUsername = async () => {
    setUsernameError("");
    try {
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
    } catch(err: any) {
      setUsernameError(err.response.data.message)
    }
    
  };

  const handleChangeEmail = async () => {
    setEmailError("");
    try{
      const response = await axios.post('/api/auth/emailChange', {
        email: newEmail,
        curEmail: user.email
      });
      if (response.status == 200) {
        console.log('Email actualizado con éxito');
        //actualizamos la sesion.
        update({ user: {...session?.user, email: newEmail} });
      } else {
        console.error('Error al actualizar el email');
      }
    } catch(err: any) {
      setEmailError(err.response.data.message);
    }
    
  };

  const irADashboard = () => {
    return router.push('/dashboard')
  };

  return (
    <div>
      <MyNavbar
        page={"profile"}
      />
      {session ? (
        <>
          <div className='justify-center h-[calc(100vh-4rem)] flex items-center'>
            <Card className="w-[30rem]">
              <CardHeader className="flex gap-3">
                <Avatar
                  name={user.username}
                  radius='sm'
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
                  errorMessage={emailError}
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
                  errorMessage={usernameError}
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
                  errorMessage={passwordError}
                />
                <Button color='primary' className='mt-1' onClick={handleChangePassword}>Actualizar contraseña</Button>

              </CardBody>
              <Divider />
              <CardFooter>
                
              </CardFooter>
            </Card>
          </div>
        </>
      ) : <p>Debes iniciar sesión para ver tu perfil</p>}
    </div>
  )
}

export default ProfilePage