"use client"
import { ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";
import { FormEvent } from "react";
import axios, { AxiosError } from "axios";
import { useSession } from 'next-auth/react'

export default function EventModal({ setEventCreated }: { setEventCreated: Function }) {
  const { data: session, status } = useSession()
  const user = session?.user as any;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>, closeModal: Function) => {//esto es como hacer function handleSubmit(e: ...) {...}
    e.preventDefault();


    const formData = new FormData(e.currentTarget);//sacamos los datos de formulario
    try {
      const res = await axios.post("/api/events/createEvent", {
        title: formData.get("title"),
        start: formData.get("start"),
        end: formData.get("end"),
        creator: user?._id
      });
      console.log(res);
      if(res.data.status == 'ok') {
        //cerramos el modal y lo añadimos al calendario...
        closeModal();
        setEventCreated(true);
      }
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
      }
    }
  }
  return (
    <>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1"  style={{ color: 'white' }}>Crear evento</ModalHeader>
            <form onSubmit={(e) => handleSubmit(e, onClose)}>
              <ModalBody>

                <Input
                  isRequired
                  autoFocus
                  label="Título"
                  name="title"
                  placeholder="Título del evento"
                  variant="bordered"
                  style={{ color: 'white' }}
                />
                <Input className="mt-2"
                  isRequired
                  label="Fecha inicio"
                  name="start"
                  placeholder="Enter your password"
                  type="datetime-local"
                  variant="bordered"
                  style={{ color: 'white' }}
                />
                <Input className="mt-2"
                  isRequired
                  label="Fecha fin"
                  name="end"
                  placeholder="Enter your password"
                  type="datetime-local"
                  variant="bordered"
                  style={{ color: 'white' }}
                />

              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Cancelar
                </Button>
                <Button color="primary" type="submit">
                  Crear
                </Button>
              </ModalFooter>
            </form>
          </>
        )}
      </ModalContent>
    </>
  );
}