'use client'//ojo https://stackoverflow.com/questions/74614922/super-expression-must-either-be-null-or-a-function-nextjs-13
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import dayjs from 'dayjs';
import 'dayjs/locale/es'

function CalendarTest({ events, openEventInfoModal, components }: any) {
  dayjs.locale("es");
  const localizer = dayjsLocalizer(dayjs);
  const messages = {
    allDay: "Todo el día",
    previous: "Anterior",
    next: "Siguiente",
    today: "Hoy",
    month: "Mes",
    week: "Semana",
    day: "Día",
    agenda: "Agenda",
    date: "Fecha",
    time: "Hora",
    event: "Evento",
    noEventsInRange: "Sin eventos"
  };
  const handleEventClick = (event: { start: Date; end: Date; title: string }) => {
    openEventInfoModal(event);
  };

  return (
    <div style={{
      height: "60em",
      width: "80em"
    }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 700 }}
          onSelectEvent={handleEventClick}
          messages={messages}
          culture="es"
          components={components}
        />
    </div>
  )
}

export default CalendarTest