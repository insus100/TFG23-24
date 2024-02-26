"use client"
import { ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Checkbox, Input, Link } from "@nextui-org/react";
import { FormEvent } from "react";
import axios, { AxiosError } from "axios";
import { useSession } from 'next-auth/react'

export default function EventModal() {
  const { data: session, status } = useSession()
  const user = session?.user as any;
  const handleSubmit = async (e: FormEvent<HTMLFormElement>, closeModal: Function) => {//esto es como hacer function handleSubmit(e: ...) {...}
    e.preventDefault();

    const formData = new FormData(e.currentTarget);//sacar datos de formulario
    try {
      const res = await axios.post("/api/events/createEvent", {
        title: formData.get("title"),
        start: formData.get("start"),
        end: formData.get("end"),
        creator: user?._id
      });
      console.log(res);
      if(res.data.status == 'ok') {
        //cerrar el modal y añadirlo al calendario...
        closeModal();
      }
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        //setError(error.response?.data.message)
      }
    }
  }
  return (
    <>
      {/*<Button onPress={onOpen} color="primary">Open Modal</Button>*/}
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Crear evento</ModalHeader>
            <form onSubmit={(e) => handleSubmit(e, onClose)}>
              <ModalBody>

                <Input
                  isRequired
                  autoFocus
                  label="Título"
                  name="title"
                  placeholder="Título del evento"
                  variant="bordered"
                />
                <Input className="mt-2"
                  isRequired
                  label="Fecha inicio"
                  name="start"
                  placeholder="Enter your password"
                  type="datetime-local"
                  variant="bordered"
                />
                <Input className="mt-2"
                  isRequired
                  label="Fecha fin"
                  name="end"
                  placeholder="Enter your password"
                  type="datetime-local"
                  variant="bordered"
                />
                {/*<div className="flex py-2 px-1 justify-between">
                  <Checkbox
                    classNames={{
                      label: "text-small",
                    }}
                  >
                    Remember me
                  </Checkbox>
                  <Link color="primary" href="#" size="sm">
                    Forgot password?
                  </Link>
                  </div>*/}

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