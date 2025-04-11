import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

const FormularioTurno = ({ onClose, onTurnoCreado }) => {
  const [nombreClienta, setNombreClienta] = useState("");
  const [dia, setDia] = useState("");
  const [hora, setHora] = useState("");
  const [observacion, setObservacion] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación personalizada
    if (!hora) {
      alert("Por favor seleccioná una hora válida.");
      return;
    }

    const nuevoTurno = {
      nombreClienta,
      dia,
      hora,
      observacion,
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/turnos`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nuevoTurno),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Limpiar formulario
        setNombreClienta("");
        setDia("");
        setHora("");
        setObservacion("");

        if (onTurnoCreado) onTurnoCreado();
        if (onClose) onClose();
      } else {
        console.error("Error al guardar el turno:", data?.message || "Error desconocido");
        alert("Error al guardar el turno: " + (data?.message || "Error desconocido"));
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      alert("Error en la solicitud: " + error.message);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Nombre de la clienta</Form.Label>
        <Form.Control
          type="text"
          value={nombreClienta}
          onChange={(e) => setNombreClienta(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Día</Form.Label>
        <Form.Control
          type="date"
          value={dia}
          onChange={(e) => setDia(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Hora</Form.Label>
          <Form.Control
            type="time"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
          />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Observación</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={observacion}
          onChange={(e) => setObservacion(e.target.value)}
        />
      </Form.Group>

      <div className="d-flex justify-content-end">
        <Button variant="secondary" onClick={onClose} className="me-2">
          Cancelar
        </Button>
        <Button variant="primary" type="submit">
          Guardar Turno
        </Button>
      </div>
    </Form>
  );
};

export default FormularioTurno;
