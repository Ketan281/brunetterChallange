import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Main from "./components/Main";
import { ToastContainer } from "react-toastify";
import logo from "./assets/brunette_logo.png";
import "./App.css";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Synchronize with localStorage on initial render
    const user = localStorage.getItem("user");
    setIsAuthenticated(!!user);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true); // Trigger re-render when user logs in
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsAuthenticated(false);
  };

  return (
    <div>
      <ToastContainer />
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <img src={logo} height={80} alt="logo" onClick={()=>localStorage.clear()}/>
      </div>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/main" /> : <Login onLogin={handleLogin} />}
        />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/main" /> : <Login onLogin={handleLogin} />}
        />
        <Route
          path="/main"
          element={
            isAuthenticated ? (
              <Main onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

export default App;
