"use client"
import { ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Checkbox, Input, Link, useDisclosure } from "@nextui-org/react";
import { FormEvent } from "react";
import axios, { AxiosError } from "axios";
import { useSession } from 'next-auth/react'
import { useState } from 'react';

interface commentModalProps {
  selectedEvent: any;
}

export default function CommentModal({ selectedEvent }: commentModalProps) {
  const { data: session, status } = useSession()
  const user = session?.user as any;

  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState<number>(1)



  const handleSubmit = async () => {
    const response = await axios.post('/api/events/addComment', {
        comment: newComment,
        rating: newRating,
        _id: selectedEvent._id,
        userId: user._id
        });
        if (response.status == 200) {
        console.log('Evento comentado con éxito');
        } else {
        console.error('Error al comentar evento');
        }
  }


  return (
    <>
      {/*<Button onPress={onOpen} color="primary">Open Modal</Button>*/}
      <ModalContent>
        {(onClose) => (
          <>
              <ModalHeader className="flex flex-col gap-1"  style={{ color: 'white' }}>Añadir Valoración</ModalHeader>
              <ModalBody>

              <Input
                  variant="bordered"
                  type="comment"
                  label="Añadir Comentario:"
                  placeholder="Añade aquí tu comentario"
                  name="comment"
                  className="w-full"
                  onChange={(e) => setNewComment(e.target.value)}
                  style={{ color: 'white' }}
                />
                <Input
                variant="bordered"
                type="number"
                label="Valoración (1-5):"
                placeholder="Ingresa tu valoración (1-5)"
                name="rating"
                min={1}
                max={5}
                value={newRating.toString()}
                onChange={(e) => setNewRating(parseInt(e.target.value))}
                style={{ color: 'white' }}
                />

              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Cancelar
                </Button>
                <Button color='primary' className='mt-1' onPress={handleSubmit}>
                    Comentar
                </Button>
              </ModalFooter>
          </>
        )}
      </ModalContent>
    </>
  );
}