"use client"
import { ModalContent, ModalHeader, ModalBody, ModalFooter, Button, ButtonGroup, useDisclosure, Modal } from "@nextui-org/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from 'next-auth/react'
import ModifyModal from './modifyModal'
import Comment from "../components/comment";
import { Rating } from '@smastrom/react-rating'

interface showInfoModalProps {
  selectedEvent: any;
  setEventCreated: Function;
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
  const [commentsHidden, setCommentsHidden] = useState(true);
  const rating = selectedEvent.ratings.find((r: any) => r.user == user._id);
  let ratingNumber = 0;
  if(rating) {
    ratingNumber = parseInt(rating.rating)
  }
  const [eventRating, setEventRating] = useState(ratingNumber); // Initial value
  //console.log("estaApuntado", estaApuntado);
  //console.log("selectedEvent", selectedEvent);
  
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

  const showHideComments = () => {
    setCommentsHidden(!commentsHidden);
  }

  const handleChangeRating = async (value: number) => {
    if(value >= 1 && value <= 5) {
      const res = await axios.post('/api/events/valorar', {
        rating: value,
        userId: user._id,
        _id: selectedEvent._id
      })
      if(res.data.status == 'ok') {
        setEventRating(value);
      }
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
                  <p>Inicio: {selectedEvent.start.toLocaleDateString() + " " + selectedEvent.start.toLocaleTimeString()}</p>
                  <p>Fin: {selectedEvent.end.toLocaleDateString() + " " + selectedEvent.end.toLocaleTimeString()}</p>
                  <p>Creador: {selectedEvent.creator.username}</p>
                  <p>Valoración: </p> <Rating style={{ maxWidth: 150 }} value={eventRating} onChange={handleChangeRating} />
                  <h1 className="text-xl font-bold cursor-pointer hover:text-red-500" onClick={showHideComments}>{commentsHidden ? "Mostrar comentarios" : "Ocultar comentarios"}</h1>
                  <Comment hide={!commentsHidden} userId={user._id} eventId={selectedEvent._id} comments={selectedEvent.comments} />
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
          </>
        )}
      </ModalContent>
    </>
  );
}