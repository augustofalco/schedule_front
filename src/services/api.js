// src/services/api.js

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

// Ejemplo de función para obtener todos los turnos
export async function getAllSchedules() {
  const res = await fetch(`${API_BASE_URL}/schedule`);
  return await res.json();
}

// Podés seguir sumando funciones similares para otros endpoints
