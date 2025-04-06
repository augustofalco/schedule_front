import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Container } from '@mui/material';

const FormularioTurno = ({ onGuardarTurno, onClose, onTurnoGuardado }) => {
  const [turno, setTurno] = useState({
    dia: '',
    hora: '',
    nombreClienta: '',
    observacion: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTurno((prevTurno) => ({
      ...prevTurno,
      [name]: value,
    }));
  };

  const guardarTurno = async (turno) => {
    try {
      const response = await fetch('http://localhost:3001/api/turnos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(turno),
      });

      if (!response.ok) throw new Error('Error al guardar turno');
      const data = await response.json();
      console.log('Turno guardado:', data);

      // Recargamos el calendario si se pasa la función onTurnoGuardado
      if (onTurnoGuardado) {
        onTurnoGuardado(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    guardarTurno(turno);  // Llamamos a guardarTurno aquí
    setTurno({ dia: '', hora: '', nombreClienta: '', observacion: '' });
    if (onClose) onClose(); // Cerramos el modal si existe la función
  };

  return (
    <Container component="main" maxWidth="xs">
      <Typography variant="h5" align="center" gutterBottom>
        Agendar Nuevo Turno
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Día"
              type="date"
              name="dia"
              value={turno.dia}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Hora"
              type="time"
              name="hora"
              value={turno.hora}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nombre de la Clienta"
              name="nombreClienta"
              value={turno.nombreClienta}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Observación"
              name="observacion"
              value={turno.observacion}
              onChange={handleChange}
              multiline
              rows={3}
            />
          </Grid>
          <Grid item xs={12} container justifyContent="space-between">
            <Button variant="outlined" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" color="error">
              Guardar Turno
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default FormularioTurno;


