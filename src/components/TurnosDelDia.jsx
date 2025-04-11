import React, { useEffect, useState } from "react";

const TurnosDelDia = ({ actualizar }) => {
  const [turnos, setTurnos] = useState([]);
  const [fechaFormateada, setFechaFormateada] = useState("");

  useEffect(() => {
    const obtenerTurnos = async () => {
      const hoy = new Date();

      // Formato para la API (YYYY-MM-DD)
      const año = hoy.getFullYear();
      const mes = (hoy.getMonth() + 1).toString().padStart(2, '0');
      const dia = hoy.getDate().toString().padStart(2, '0');
      const hoyFormateado = `${año}-${mes}-${dia}`;

      // Formato legible sin coma, todo en minúsculas
      const opcionesFormato = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
      let fechaLegible = hoy.toLocaleDateString("es-AR", opcionesFormato);
      fechaLegible = fechaLegible.replace(",", "").toLowerCase();

      setFechaFormateada(fechaLegible);

      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/turnos/dia/${hoyFormateado}`);
        const data = await res.json();

        const turnosOrdenados = data.sort((a, b) => a.hora.localeCompare(b.hora));
        setTurnos(turnosOrdenados);
      } catch (error) {
        console.error("Error al obtener turnos del día:", error);
      }
    };

    obtenerTurnos();
  }, [actualizar]);

  return (
    <div style={{ marginTop: "30px" }}>
      <h2 style={{ textAlign: "center" }}>
        Turnos del día {fechaFormateada}
      </h2>
      <table className="table">
        <thead>
          <tr>
            <th>Nro</th>
            <th>Nombre</th>
            <th>Hora</th>
            <th>Observación</th>
          </tr>
        </thead>
        <tbody>
          {turnos.map((turno, index) => (
            <tr key={turno.id}>
              <td>{index + 1}</td>
              <td>{turno.nombreClienta}</td>
              <td>{turno.hora}</td>
              <td>{turno.observacion}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TurnosDelDia;

