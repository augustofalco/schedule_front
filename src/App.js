import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Inicio from './pages/Inicio'; // ahora usamos Inicio en lugar de Home
import Calendario from './pages/Calendario';
import Configuracion from './pages/Configuracion';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <Router>
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={{ marginLeft: "220px", padding: "20px", width: "100%", backgroundColor: "#ffe6f0", minHeight: "100vh" }}>
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/calendario" element={<Calendario />} />
            <Route path="/configuracion" element={<Configuracion />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;



