import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import './Calendario.css';

const Calendario = ({ actualizar }) => {
  const [modoEdicion, setModoEdicion] = useState(false);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);
  const [nombre, setNombre] = useState('');
  const [hora, setHora] = useState('');
  const [observacion, setObservacion] = useState('');
  const [turnos, setTurnos] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [turnosDelDia, setTurnosDelDia] = useState([]);

  // Cargar turnos desde backend
  const fetchTurnos = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/turnos`);
      const data = await response.json();
      const eventosFormateados = data.map((turno) => ({
        title: turno.nombreClienta,
        start: `${turno.dia}T${turno.hora}`,
        allDay: false,
        extendedProps: {
          observacion: turno.observacion || '',
          hora: turno.hora,
          dia: turno.dia,
        },
      }));
      setTurnos(eventosFormateados);
    } catch (error) {
      console.error('Error al obtener turnos:', error);
    }
  };

  useEffect(() => {
    fetchTurnos();
  }, [actualizar]);

  const manejarClickDia = (arg) => {
    const fecha = arg.dateStr;
    const turnosFiltrados = turnos.filter((t) => t.start.startsWith(fecha));
    setFechaSeleccionada(fecha);
    setTurnosDelDia(turnosFiltrados);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setFechaSeleccionada(null);
    setTurnosDelDia([]);
    setModoEdicion(false);
    setTurnoSeleccionado(null);
  };

  const formatoFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    return `${dia}-${mes}`;
  };

  const manejarEditar = (turno) => {
    setModoEdicion(true);
    setTurnoSeleccionado(turno);
    setNombre(turno.title);
    setHora(turno.extendedProps.hora);
    setObservacion(turno.extendedProps.observacion || '');
  };

  const guardarCambios = async () => {
    if (!nombre || !hora) {
      alert('Nombre y hora son obligatorios.');
      return;
    }
  
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/turnos`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dia: turnoSeleccionado.extendedProps.dia,
          hora,
          nombreClienta: nombre,
          observacion,
        }),
      });
  
      if (response.ok) {
        const nuevosTurnos = turnos.map((t) =>
          t.start === turnoSeleccionado.start
            ? {
                ...t,
                start: `${turnoSeleccionado.extendedProps.dia}T${hora}`,
                title: nombre,
                extendedProps: {
                  ...t.extendedProps,
                  hora,
                  observacion,
                },
              }
            : t
        );
        setTurnos(nuevosTurnos);
        // También actualizar turnosDelDia visualmente
        const filtrados = nuevosTurnos.filter((t) => t.start.startsWith(fechaSeleccionada));
        setTurnosDelDia(filtrados);
        cerrarModal();
      } else {
        console.error('Error al editar turno');
      }
    } catch (error) {
      console.error('Error en la petición de edición:', error);
    }
  };
  
  const eliminarTurno = async (turno) => {
    if (window.confirm(`¿Eliminar el turno de ${turno.title} a las ${turno.extendedProps.hora}?`)) {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/turnos`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            dia: turno.extendedProps.dia,
            hora: turno.extendedProps.hora,
          }),
        });
  
        if (response.ok) {
          const nuevosTurnos = turnos.filter((t) => t.start !== turno.start);
          setTurnos(nuevosTurnos);
  
          const filtrados = nuevosTurnos.filter((t) => t.start.startsWith(fechaSeleccionada));
          setTurnosDelDia(filtrados);
  
          if (filtrados.length === 0) cerrarModal(); // opcional
        } else {
          console.error('Error al eliminar turno');
        }
      } catch (error) {
        console.error('Error en la petición de eliminación:', error);
      }
    }
  };  

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Calendario de Turnos</h1>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale={esLocale}
        events={turnos}
        dateClick={manejarClickDia}
        dayMaxEvents={3}
        eventContent={(arg) => ({
          html: `<div style="color: white; font-weight: bold;">${arg.timeText} - ${arg.event.title}</div>`,
        })}
      />

      <Modal show={modalAbierto} onHide={cerrarModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Turnos del día: {fechaSeleccionada ? formatoFecha(fechaSeleccionada) : ''}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {turnosDelDia.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Nro.</th>
                  <th>Hora</th>
                  <th>Nombre</th>
                  <th>Observación</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {turnosDelDia.map((turno, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{turno.extendedProps.hora}</td>
                    <td>{turno.title}</td>
                    <td>{turno.extendedProps.observacion}</td>
                    <td>
                      <Button variant="warning" size="sm" className="me-2" onClick={() => manejarEditar(turno)}>
                        Editar
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => eliminarTurno(turno)}>
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No hay turnos para este día.</p>
          )}
        </Modal.Body>

        {modoEdicion && (
          <div className="p-3">
            <h5>Editar Turno</h5>
            <input
              className="form-control mb-2"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            <input
              className="form-control mb-2"
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
            />
            <input
              className="form-control mb-2"
              placeholder="Observación"
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
            />
            <Button variant="success" onClick={guardarCambios} className="me-2">
              Guardar
            </Button>
            <Button variant="secondary" onClick={() => setModoEdicion(false)}>
              Cancelar
            </Button>
          </div>
        )}

        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Calendario;

