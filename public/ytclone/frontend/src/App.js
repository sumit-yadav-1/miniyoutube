// src/App.js
import { ToastContainer } from 'react-toastify';
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./components/Home";
import Upload from "./components/Upload";
import Login from "./components/Login";
import Register from "./components/Register";
import VideoPlayer from "./components/VideoPlayer";
import Dashboard from "./components/Dashboard";
import WatchLater from "./components/WatchLater";

function AppWrapper() {
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setUsername(localStorage.getItem("username"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUsername(null);
    navigate("/");
  };

  return (
    <>
      <Navbar
        isAuthenticated={!!username}
        username={username}
        handleLogout={handleLogout}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1 p-4">
          <Routes>
            <Route path="/" element={<Home searchQuery={searchQuery} />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/login" element={<Login setUsername={setUsername} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/video/:id" element={<VideoPlayer />} />
            <Route path="/watch-later" element={<WatchLater />} />
          </Routes>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}
