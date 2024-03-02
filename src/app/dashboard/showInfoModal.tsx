"use client"
import { ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Checkbox, Input, Link } from "@nextui-org/react";
import { FormEvent } from "react";
import axios, { AxiosError } from "axios";
import { useSession } from 'next-auth/react'

interface showInfoModalProps {
  selectedEvent: any;
  onClose: () => void;
}

export default function ShowInfoModal({ selectedEvent, onClose }: showInfoModalProps) {
  const { data: session, status } = useSession()
  const user = session?.user as any;
  
  const eliminarEvento = async (e: any, selEvent: any) => {
    const res = await axios.post('/api/events/deleteEvent', {
      _id: selEvent._id
    });
    if(res.data.status == 'ok') {
      //eliminar evento del big calendar y cerrar modal.
    }
  }

  return (
    <>
      {/*<Button onPress={onOpen} color="primary">Open Modal</Button>*/}
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1" style={{ color: 'white' }}>Información del evento</ModalHeader>

            <ModalBody style={{ color: 'white' }}>
              {selectedEvent && (
                <>
                  <p>Título: {selectedEvent.title}</p>
                  <p>Inicio: {selectedEvent.start.toLocaleDateString() + " " + selectedEvent.start.toLocaleTimeString()}</p>
                  <p>Fin: {selectedEvent.end.toLocaleDateString() + " " + selectedEvent.end.toLocaleTimeString()}</p>
                  <p>Creador: {selectedEvent.creator.username}</p>
                </>
              )}
            </ModalBody>
            <ModalFooter>
              {selectedEvent && user && selectedEvent.creator._id === user._id &&
                (<>
                  <Button color="danger" variant="flat" onPress={(e) => eliminarEvento(e, selectedEvent)}>
                    Eliminar
                  </Button>
                </>)
              }

              {/* Puedes agregar más acciones o botones según tus necesidades */}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </>
  );
}