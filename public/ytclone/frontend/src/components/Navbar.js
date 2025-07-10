// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ isAuthenticated, username, handleLogout, searchQuery, setSearchQuery }) {
  const onSearch = () => {
    // Already being filtered in Home via props
  };

  const keyHandler = (e) => {
    if (e.key === "Enter") e.preventDefault();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 py-2">
      <Link className="navbar-brand d-flex align-items-center" to="/">
        <img src="https://i.ibb.co/B5LrsBsH/download-removebg-preview.png" style={{ height: 50 }} alt="logo" />
        <span className="ms-2 pt-2"><h3>Mini YouTube</h3></span>
      </Link>
      <div className="ms-auto me-auto position-relative">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
          onKeyDown={keyHandler}
          className="form-control rounded-pill ps-3"
          placeholder="Search"
          style={{ width: '500px' }}
        />
        <span
          className="position-absolute"
          style={{ right: 15, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
          onClick={onSearch}
        >🔍</span>
      </div>
      <div>
        {isAuthenticated ? (
          <>
            <span className="text-light me-2">Welcome, {username}</span>
            <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link className="btn btn-outline-light me-2" to="/login">Login</Link>
            <Link className="btn btn-light" to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
