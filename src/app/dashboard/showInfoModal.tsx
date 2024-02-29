"use client"
import { ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Checkbox, Input, Link } from "@nextui-org/react";
import { FormEvent } from "react";
import axios, { AxiosError } from "axios";
import { useSession } from 'next-auth/react'

interface showInfoModalProps {
  selectedEvent: { start: Date; end: Date; title: string } | null;
  onClose: () => void;
}

export default function ShowInfoModal({ selectedEvent, onClose }: showInfoModalProps) {
  const { data: session, status } = useSession()
  const user = session?.user as any;
  const handleSubmit = async (e: FormEvent<HTMLFormElement>, closeModal: Function) => {//esto es como hacer function handleSubmit(e: ...) {...}
    e.preventDefault();

  }
  return (
    <>
      {/*<Button onPress={onOpen} color="primary">Open Modal</Button>*/}
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1"  style={{ color: 'white' }}>Información del evento</ModalHeader>
            <form onSubmit={(e) => handleSubmit(e, onClose)}>
              <ModalBody style={{ color: 'white' }}>
            {selectedEvent && (
              <>
                <p>Título: {selectedEvent.title}</p>
                <p>Inicio: {selectedEvent.start.toString()}</p>
                <p>Fin: {selectedEvent.end.toString()}</p>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="flat" onPress={onClose}>
              Cerrar
            </Button>
            {/* Puedes agregar más acciones o botones según tus necesidades */}
          </ModalFooter>
            </form>
          </>
        )}
      </ModalContent>
    </>
  );
}