'use client'//ojo https://stackoverflow.com/questions/74614922/super-expression-must-either-be-null-or-a-function-nextjs-13
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import dayjs from "dayjs";


function CalendarTest() {
  const localizer = dayjsLocalizer(dayjs);
  return (
    <div>
        <Calendar
            localizer={localizer}
            //style={{
            //    height: 100,
            //    width: 100
            //}}
        />
    </div>
  )
}

export default CalendarTest