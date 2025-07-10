import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await axios.post("http://127.0.0.1:8000/api/register/", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      navigate("/login");
    } catch (err) {
        if (err.response) {
            console.log("Registration Error:", err.response.data);  // 👈 SHOW THE ACTUAL ERROR
            setError("Registration failed. Try a different username or email.");
        } else {
            setError("Something went wrong. Please try again.");
        }
      //setError("Registration failed. Try a different username or email.");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h3 className="text-center mb-4">Create your Mini YouTube Account</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit} className="border p-4 shadow rounded">
        <div className="mb-3">
          <label>Username</label>
          <input type="text" className="form-control" name="username" onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input type="email" className="form-control" name="email" onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input type="password" className="form-control" name="password" onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Confirm Password</label>
          <input type="password" className="form-control" name="confirmPassword" onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-danger w-100">Register</button>
      </form>
      <p className="text-center mt-3">
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
}

export default Register;