import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>🏵️Margarita Nails</h2>
      <ul>
        <li>
          <Link to="/">
            🏠 Inicio
          </Link>
        </li>
        <li>
          <Link to="/calendario">
            📅 Calendario
          </Link>
        </li>
        <li>
          <Link to="/configuracion">
            ⚙️ Configuración
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
