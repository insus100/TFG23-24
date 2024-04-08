"use client"
import { ModalContent, ModalHeader, ModalBody, ModalFooter, Button, ButtonGroup, Checkbox, Input, Link, useDisclosure, Modal, select } from "@nextui-org/react";
import { FormEvent, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useSession } from 'next-auth/react'
import ModifyModal from './modifyModal'
import CommentModal from './commentModal'
import Comment from "../components/comment";

interface showInfoModalProps {
  selectedEvent: any;
  setEventCreated: Function;
}
const comments = {//esto tiene que salir de la base de datos
  id: 1,
  items: [
    {
      id:2312349128,
      name: "hello",
      items: [
        {
          id:298292929,
          name: "hello world",
          items:[
            {
              id:2982929292,
              name: "hello world 2",
              items:[]
            }
          ]
        }
      ]
    },
    {
      id: 399999,
      name: "react js",
      items: [
        {
          id:38383838,
          name:"que pedo bue",
          items: []
        }
      ]
    }
  ]
}
export default function ShowInfoModal({ selectedEvent, setEventCreated  }: showInfoModalProps) {
  const { data: session, status } = useSession()
  const user = session?.user as any;
  const { isOpen: isModifyModalOpen, onOpen: onModifyModalOpen, onOpenChange: onModifyModalOpenChange } = useDisclosure();
  const { isOpen: isCommentModalOpen, onOpen: onCommentModalOpen, onOpenChange: onCommentModalOpenChange } = useDisclosure();
  const [estaApuntado, setEstaApuntado] = useState(selectedEvent.attendingUsers.find((u: any) => u._id == user._id) ? true : false);
  const [loadingButton, setLoadingButton] = useState(false);
  const [loadingButton2, setLoadingButton2] = useState(false);
  const [esFavorito, setEsFavorito] = useState(selectedEvent.favorites.find((u: any) => u._id == user._id) ? true : false);
  const [commentsData, setCommentsData] = useState(comments);
  //console.log("estaApuntado", estaApuntado);
  console.log("selectedEvent", selectedEvent);
  
  const eliminarEvento = async (e: any, selEvent: any, onClose: Function) => {
    const res = await axios.post('/api/events/deleteEvent', {
      _id: selEvent._id
    });
    if(res.data.status == 'ok') {
      //eliminar evento del big calendar y cerrar modal.
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

  const agregarAFavorito = async (e: any, selEvent: any) => {
    console.log("Agregando a favorito: ", selEvent);
    setLoadingButton2(true);
    const res = await axios.post('/api/events/agregarFavorito', {
      _id: selEvent._id,
      userId: user._id,
    });
    if(res.data.status == 'ok') {
      setLoadingButton2(false);
      setEsFavorito(true);
    }
  }

  const quitarDeFavorito = async(e: any, selEvent: any) => {
    console.log("quitando de favoritos: ", selEvent);
    setLoadingButton2(true);
    const res = await axios.post('/api/events/quitarFavorito', {
      _id: selEvent._id,
      userId: user._id,
    });
    if(res.data.status == 'ok') {
      setLoadingButton2(false);
      setEsFavorito(false);
    }
  }



  useEffect(() => {
    setEventCreated(true);
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
                  <p>Inicio: {new Date(selectedEvent.start).toLocaleDateString() + " " + new Date(selectedEvent.start).toLocaleTimeString()}</p>
                  <p>Fin: {new Date(selectedEvent.end).toLocaleDateString() + " " + new Date(selectedEvent.end).toLocaleTimeString()}</p>
                  <p>Creador: {selectedEvent.creator.username}</p>
                  <p>Valoración media: </p>
                  <h1 className="text-xl font-bold">Comentarios</h1>
                  <Comment comments={selectedEvent.comments} />
                </>
              )}
            </ModalBody>
            <ModalFooter>
              <ButtonGroup>
              {selectedEvent && user && selectedEvent.creator._id === user._id &&
                (<>
                  <Button color="danger" variant="flat" onPress={(e) => eliminarEvento(e, selectedEvent, onClose)}>
                    Eliminar
                  </Button>
                  <Button color="primary" variant="flat" onPress={onModifyModalOpen} >
                    Modificar
                  </Button>
                  <Button color="primary" variant="flat" onPress={onCommentModalOpen} >
                    Valorar
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
              {selectedEvent && user ? <>
                {!esFavorito ? (//si no lo tiene como favorito...
                  <>
                    <Button color="success" variant="flat" isLoading={loadingButton2} onPress={(e) => agregarAFavorito(e, selectedEvent)} >
                      Favorito
                    </Button>
                  </>
                ) :
                  <>
                    <Button color="danger" variant="flat" isLoading={loadingButton2} onPress={(e) => quitarDeFavorito(e, selectedEvent)} >
                      Quitar Favorito
                    </Button>
                  </>
                }
              </> : null }
              
              {/* Puedes agregar más acciones o botones según tus necesidades */}
              </ButtonGroup>
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
            <Modal
            isOpen={isCommentModalOpen}
            onOpenChange={onCommentModalOpenChange}
            placement="top-center"
            >
            {selectedEvent && (
              <CommentModal selectedEvent={selectedEvent}  />
            )}
            </Modal>
          </>
        )}
      </ModalContent>
    </>
  );
}