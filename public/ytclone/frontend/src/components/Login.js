// src/components/Login.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login({ setUsername }) {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/login/", formData, {
        withCredentials: true,
      });

      // ✅ Save access & refresh tokens for future requests
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      // ✅ Save username for UI
      localStorage.setItem("username", formData.username);
      setUsername(formData.username);

      navigate("/");
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h3 className="text-center mb-4">Welcome Back to Mini YouTube</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit} className="border p-4 shadow rounded">
        <div className="mb-3">
          <label>Username</label>
          <input
            type="text"
            className="form-control"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-danger w-100">
          Login
        </button>
      </form>
      <p className="text-center mt-3">
        Don't have an account? <a href="/register">Register</a>
      </p>
    </div>
  );
}

export default Login;