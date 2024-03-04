"use client"
import { ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Checkbox, Input, Link, useDisclosure, Modal, select } from "@nextui-org/react";
import { FormEvent, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useSession } from 'next-auth/react'
import ModifyModal from './modifyModal'

interface showInfoModalProps {
  selectedEvent: any;
  onClose: () => void;
  setEventCreated: Function;
}

export default function ShowInfoModal({ selectedEvent, onClose, setEventCreated  }: showInfoModalProps) {
  const { data: session, status } = useSession()
  const user = session?.user as any;
  const { isOpen: isModifyModalOpen, onOpen: onModifyModalOpen, onOpenChange: onModifyModalOpenChange } = useDisclosure();
  const [estaApuntado, setEstaApuntado] = useState(selectedEvent.attendingUsers.find((u: any) => u._id == user._id) ? true : false);
  const [loadingButton, setLoadingButton] = useState(false);

  console.log("estaApuntado", estaApuntado);

  const eliminarEvento = async (e: any, selEvent: any, onClose: Function) => {
    const res = await axios.post('/api/events/deleteEvent', {
      _id: selEvent._id
    });
    if(res.data.status == 'ok') {
      //eliminar evento del big calendar y cerrar modal.
      //TODO Quitarlo del calendario...
      onClose();
    }
  }

  const apuntarseAEvento = async (e: any, selEvent: any) => {
    console.log("Apuntandose a evento: ", selEvent);
    setLoadingButton(true);
    const res = await axios.post('/api/events/apuntarse', {
      _id: selEvent._id,
      userId: user._id,
    });
    if(res.data.status == 'ok') {
      setLoadingButton(false);
      setEstaApuntado(true);
    }
  }

  const desapuntarseAEvento = async(e: any, selEvent: any) => {
    console.log("desapuntandose de evento: ", selEvent);
    setLoadingButton(true);
    const res = await axios.post('/api/events/desapuntarse', {
      _id: selEvent._id,
      userId: user._id,
    });
    if(res.data.status == 'ok') {
      setLoadingButton(false);
      setEstaApuntado(false);
    }
  }
  useEffect(() => {
    setEventCreated(true);
    setEstaApuntado(selectedEvent.attendingUsers.find((u: any) => u._id == user._id) ? true : false);
  }, [])
  //setEventCreated(true);//esto espamea el mensaje MongoDB connected en la consola. (El del GET de createEvent)
  //+info https://www.reactjs.wiki/too-many-re-renders-react-limits-the-number-of-renders-to-prevent-an-infinite-loop
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
                  <Button color="danger" variant="flat" onPress={(e) => eliminarEvento(e, selectedEvent, onClose)}>
                    Eliminar
                  </Button>
                  <Button color="primary" variant="flat" onPress={onModifyModalOpen} >
                    Modificar
                  </Button>
                </>)
              }
              {selectedEvent && user ? <>
                {!estaApuntado ? (//si no está ya apuntado...
                  <>
                    <Button color="success" variant="flat" isLoading={loadingButton} onPress={(e) => apuntarseAEvento(e, selectedEvent)} >
                      Apuntarse
                    </Button>
                  </>
                ) :
                  <>
                    <Button color="danger" variant="flat" isLoading={loadingButton} onPress={(e) => desapuntarseAEvento(e, selectedEvent)} >
                      Desapuntarse
                    </Button>
                  </>
                }
              </> : null }
              
              {/* Puedes agregar más acciones o botones según tus necesidades */}
            </ModalFooter>
            <Modal
            isOpen={isModifyModalOpen}
            onOpenChange={onModifyModalOpenChange}
            placement="top-center"
            >
            {selectedEvent && (
              <ModifyModal selectedEvent={selectedEvent}  />
            )}
            </Modal>
          </>
        )}
      </ModalContent>
    </>
  );
}