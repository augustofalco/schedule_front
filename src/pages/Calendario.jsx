import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import './Calendario.css';

const Calendario = () => {
  const [turnos, setTurnos] = useState([]);

  // Simulación de carga de turnos desde una fuente externa
  useEffect(() => {
    // Aquí deberías hacer una llamada a tu backend para obtener los turnos
    // Por ejemplo: fetch('/api/turnos').then(response => response.json()).then(data => setTurnos(data));
    const turnosEjemplo = [
      { title: 'Turno 1', date: '2025-04-10' },
      { title: 'Turno 2', date: '2025-04-15' },
      { title: 'Turno 3', date: '2025-04-20' },
    ];
    setTurnos(turnosEjemplo);
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Calendario de Turnos</h1>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        locale="es" // Para mostrar el calendario en español
        events={turnos}
      />
    </div>
  );
};

export default Calendario;



