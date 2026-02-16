import React, { useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
export const FullCalendarWrapper = ({
  events,
  onDateSet,
  onEventClick,
  onSelect,
  onEventDrop,
  eventContent,
  height = "800px",
  contentHeight = "780px"
}) => {
  const calendarRef = useRef(null);
  return /*#__PURE__*/React.createElement("div", {
    className: "full-calendar-wrapper"
  }, /*#__PURE__*/React.createElement("style", null, `
                .fc-event-title {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .fc-daygrid-event {
                    white-space: nowrap;
                    overflow: hidden;
                }
            `), /*#__PURE__*/React.createElement(FullCalendar, {
    ref: calendarRef,
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: "dayGridMonth",
    locale: esLocale,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    buttonText: {
      today: 'Dia Actual',
      month: 'Mes',
      week: 'Semana',
      day: 'Dia'
    },
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    events: events // Pass array of events directly
    ,
    datesSet: onDateSet // Capture date range changes
    ,
    eventClick: onEventClick,
    select: onSelect,
    eventDrop: onEventDrop,
    height: height,
    contentHeight: contentHeight,
    nowIndicator: true,
    navLinks: true,
    businessHours: true,
    eventContent: eventContent
  }));
};