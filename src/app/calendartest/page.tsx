'use client'//ojo https://stackoverflow.com/questions/74614922/super-expression-must-either-be-null-or-a-function-nextjs-13
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import dayjs from 'dayjs';

interface CalendarTestProps {
  events: { start: Date; end: Date; title: string }[];
  setSelectedEvent: React.Dispatch<React.SetStateAction<{ start: Date; end: Date; title: string } | null>>;
}

function CalendarTest({ events, setSelectedEvent }: CalendarTestProps) {
  const localizer = dayjsLocalizer(dayjs);

  const handleEventClick = (event: { start: Date; end: Date; title: string }) => {
    setSelectedEvent(event);
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
        />
    </div>
  )
}

export default CalendarTest