"use client"
import { ModalContent, ModalHeader, ModalBody, ModalFooter, Button, ButtonGroup, Checkbox, Input, Link, useDisclosure, Modal, select } from "@nextui-org/react";
import { FormEvent, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useSession } from 'next-auth/react'

interface showUserModalProps {
  selectedUser: any;
}

export default function ShowUserModal({ selectedUser  }: showUserModalProps) {
  const { data: session, status } = useSession()
  const user = session?.user as any;
  const [loadingButton, setLoadingButton] = useState(false);
  const [seguido, setSeguido] = useState(selectedUser.followers.find((u: any) => u._id == user._id) ? true : false);

  if(seguido){
    console.log("Hola");
  }

  const seguirUsuario = async (e: any, selUser: any) => {
    console.log("Siguiendo a usuario: ", selUser);
    setLoadingButton(true);
    const res = await axios.post('/api/users/seguir', {
      _id: selUser._id,
      userId: user._id,
    });
    if(res.data.status == 'ok') {
      setLoadingButton(false);
      setSeguido(true);
    }
  }

  const dejarDeSeguirUsuario = async(e: any, selUser: any) => {
    console.log("dejando de seguir usuario: ", selUser);
    setLoadingButton(true);
    const res = await axios.post('/api/users/dejarDeSeguir', {
      _id: selUser._id,
      userId: user._id,
    });
    if(res.data.status == 'ok') {
      setLoadingButton(false);
      setSeguido(false);
    }
  }

  return (
    <>
      {/*<Button onPress={onOpen} color="primary">Open Modal</Button>*/}
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1" style={{ color: 'white' }}>Información del usuario</ModalHeader>

            <ModalBody style={{ color: 'white' }}>
              {selectedUser && (
                <>
                  <p>Username: {selectedUser.username}</p>
                  <p>Email: {selectedUser.email}</p>
                </>
              )}
            </ModalBody>
            <ModalFooter>
              <ButtonGroup>
              {selectedUser && user ? <>
                {!seguido ? (
                  <>
                    <Button color="success" variant="flat" isLoading={loadingButton} onPress={(e) => seguirUsuario(e, selectedUser)} >
                      Seguir
                    </Button>
                  </>
                ) :
                  <>
                    <Button color="danger" variant="flat" isLoading={loadingButton} onPress={(e) => dejarDeSeguirUsuario(e, selectedUser)} >
                      Dejar de Seguir
                    </Button>
                  </>
                }
              </> : null }
              
              {/* Puedes agregar más acciones o botones según tus necesidades */}
              </ButtonGroup>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </>
  );
}