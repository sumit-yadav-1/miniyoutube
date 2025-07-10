import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <div className="bg-light border-end p-3" style={{ minHeight: '100vh', width: '220px' }}>
      <ul className="nav flex-column">
        <li className="nav-item mb-2">
          <Link className="nav-link" to="/">🏠 Home</Link>
        </li>
        <li className="nav-item mb-2">
          <Link className="nav-link" to="/upload">⬆️ Upload</Link>
        </li>
        <li className="nav-item mb-2">
          <Link className="nav-link" to="/dashboard">📁 Dashboard</Link>
        </li>
        <li className="nav-item mb-2">
          <Link className="nav-link" to="/watch-later">🕒 Watch Later</Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
