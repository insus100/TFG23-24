"use client"
import { ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Calendar, Listbox, ListboxItem } from "@nextui-org/react";
import axios from "axios";
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react';
import { DateValue, getLocalTimeZone, parseDate } from "@internationalized/date";
import { FaTrashAlt } from "react-icons/fa";

export default function RecordatoriosModal({ selectedEvent }: any) {
    const { data: session } = useSession()
    const user = session?.user as any;
    const [puedeSeleccionar, setPuedeSeleccionar] = useState(false);
    const [recordatorios, setRecordatorios] = useState<any>([]);
    const [focusedDate, setFocusedDate] = useState(null);
    const anadirFecha = async (date: DateValue) => {
      setPuedeSeleccionar(false);
      const res = await axios.post('/api/users/recordatorio', {
        _id: user._id,
        eventId: selectedEvent._id,
        date: date.toDate('UTC')
      });
      if(res.data.status == 'ok') {
        setFocusedDate(null);
        await getUserRecordatorios();
        setPuedeSeleccionar(true);
      }
      
    }

    const eliminarRecordatorio = async (date: any) => {
      console.log("eliminarRecordatorio", date)
      const res = await axios.post('/api/users/recordatorio', {
        _id: user._id,
        eventId: selectedEvent._id,
        date: date,
        eliminar:true
      });
      await getUserRecordatorios();
    }

    const isDateUnavailable = (date: DateValue) => {
      //verificamos con los recordatorios que ya ha puesto el usuario
      if(recordatorios && recordatorios.find((r: any) => r.event == selectedEvent._id && r.reminder == date.toDate('UTC').toISOString())) return true;
      return false;
    }

    const getUserRecordatorios = async () => {
      const res = await axios.get('/api/users/recordatorio', {
        params: {
          userId: user._id
        }
      });
      setRecordatorios(res.data.eventReminders);
      console.log("getUserRecordatorios res.data ", res.data.eventReminders)
    }
    useEffect(() => {
      (async () => {
        try {
          await getUserRecordatorios();
          setPuedeSeleccionar(true);
        } catch (error) {
          console.error("Error al obtener recordatorios:", error);
        }
      })();
    }, []);
    return (
        <>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1" style={{ color: 'white' }}>Administrar recordatorios</ModalHeader>
    
                <ModalBody style={{ color: 'white' }}>

                    <Calendar
                      aria-label="Selecciona fecha"
                      value={focusedDate}
                      isDisabled={!puedeSeleccionar}
                      maxValue={parseDate(selectedEvent.end.toISOString().split("T")[0])}
                      isDateUnavailable={isDateUnavailable}
                      onChange={anadirFecha}
                    />
                    <div aria-label="div1" className="flex flex-col gap-2">
                      <div  aria-label="div2" className="center border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
                            <Listbox 
                              aria-label="Single selection"
                              variant="flat"
                              color="danger"
                              onAction={eliminarRecordatorio}
                            >
                              {
                                recordatorios.map((r: any) =>
                                  r.event == selectedEvent._id && (<ListboxItem key={r.reminder} aria-label="item">{new Date(r.reminder).toLocaleDateString('es-CL')} <FaTrashAlt aria-label="icon" className="inline content-end" /></ListboxItem>)
                                )
                              }
                            </Listbox>
                          </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                  {selectedEvent && user && selectedEvent.creator._id === user._id &&
                    (<>
                        <Button color="primary" type="submit" onPress={onClose}>
                        Cerrar
                        </Button>
                    </>)
                  }
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </>
      );

}