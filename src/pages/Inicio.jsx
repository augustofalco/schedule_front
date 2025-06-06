import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import FormularioTurno from "../components/FormularioTurno";
import TurnosDelDia from "../components/TurnosDelDia";
import 'bootstrap/dist/css/bootstrap.min.css';

const Inicio = () => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [actualizarTurnos, setActualizarTurnos] = useState(false);

  const abrirModal = () => setMostrarModal(true);
  const cerrarModal = () => setMostrarModal(false);

  const manejarTurnoCreado = () => {
    setActualizarTurnos(true);
    setTimeout(() => setActualizarTurnos(false), 500);
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#ffe6f0", minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center", color: "#cc0066", marginBottom: "40px" }}>
        Bienvenida, Belén!
      </h1>

      <div style={{ textAlign: "center" }}>
        <Button variant="danger" onClick={abrirModal}>
          Agregar nuevo turno
        </Button>
      </div>

      <TurnosDelDia actualizar={actualizarTurnos} />

      <Modal show={mostrarModal} onHide={cerrarModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Agendar nuevo turno</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormularioTurno onClose={cerrarModal} onTurnoCreado={manejarTurnoCreado} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Inicio;


