"use client"
import { ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Checkbox, Input, Link, useDisclosure } from "@nextui-org/react";
import { FormEvent } from "react";
import axios, { AxiosError } from "axios";
import { useSession } from 'next-auth/react'
import { useState } from 'react';

interface modifyModalProps {
  selectedEvent: any;
}

export default function ModifyModal({ selectedEvent }: modifyModalProps) {
  const { data: session, status } = useSession()
  const user = session?.user as any;

  const [newTitle, setNewTitle] = useState('');
  const [newStart, setNewStart] = useState('');
  const [newEnd, setNewEnd] = useState('');



  const handleChangeTitle = async () => {
    const response = await axios.post('/api/events/titleChange', {
        title: newTitle,
        curTitle: selectedEvent.title
        });
        if (response.status == 200) {
        console.log('Titulo actualizado con éxito');
        selectedEvent.title = newTitle;
        } else {
        console.error('Error al actualizar el titulo');
        }
  };

  const handleChangeStart = async () => {
    const response = await axios.post('/api/events/startChange', {
        start: newStart,
        curTitle: selectedEvent.title
        });
        if (response.status == 200) {
        console.log('Comienzo del evento actualizado con éxito');
        } else {
        console.error('Error al actualizar el comienzo del evento');
        }
  };

  const handleChangeEnd = async () => {
    const response = await axios.post('/api/events/endChange', {
        end: newEnd,
        curTitle: selectedEvent.title
        });
        if (response.status == 200) {
        console.log('Final del evento actualizado con éxito');
        } else {
        console.error('Error al actualizar el final del evento');
        }
  };
  

  return (
    <>
      {/*<Button onPress={onOpen} color="primary">Open Modal</Button>*/}
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1" style={{ color: 'white' }}>Modificar evento</ModalHeader>

            <ModalBody style={{ color: 'white' }}>
              <Input
                  variant="bordered"
                  type="title"
                  label="Actualizar titulo:"
                  placeholder="Actualizar titulo"
                  name="titulo"
                  className="w-full"
                  defaultValue={selectedEvent.title}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{ color: 'white' }}
                />
                <Button color='primary' className='mt-1' onClick={handleChangeTitle}>Actualizar titulo</Button>

                <Input
                  variant="bordered"
                  type="datetime-local"
                  label="Actualizar comienzo del evento:"
                  placeholder="Actualizar comienzo del evento"
                  name="start"
                  className="w-full mt-4"
                  onChange={(e) => setNewStart(e.target.value)}
                  style={{ color: 'white' }}
                />
                <Button color='primary' className='mt-1' onClick={handleChangeStart}>Actualizar comienzo del evento</Button>

                <Input
                  variant="bordered"
                  type="datetime-local"
                  label="Actualizar final del evento:"
                  placeholder="Actualizar final del evento"
                  name="end"
                  className="w-full mt-4"
                  onChange={(e) => setNewEnd(e.target.value)}
                  style={{ color: 'white' }}
                />
                <Button color='primary' className='mt-1' onClick={handleChangeEnd}>Actualizar final del evento</Button>

            </ModalBody>
            <ModalFooter>
              {selectedEvent && user && selectedEvent.creator._id === user._id &&
                (<>
                    <Button color="primary" type="submit" onPress={onClose}>
                    Terminar
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