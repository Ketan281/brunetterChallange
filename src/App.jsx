import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Main from "./components/Main";
import { ToastContainer } from "react-toastify";
import logo from "./assets/brunette_logo.png"
import "./App.css"
const App = () => {
  // Check if the user is already logged in
  const isAuthenticated = !!localStorage.getItem("user");

  return (
    <div>
      <ToastContainer />
      <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
        <img src={logo} height={80} alt="logo"/>
      </div>
      <Routes>
  {/* Default Route: Sign In */}
  <Route
    path="/"
    element={
      isAuthenticated ? <Navigate to="/main" /> : <Login />
    }
  />
  {/* Login Route */}
  <Route
    path="/login"
    element={
      isAuthenticated ? <Navigate to="/main" /> : <Login />
    }
  />
  {/* Main Route: Protected */}
  <Route
    path="/main"
    element={
      isAuthenticated ? <Main /> : <Navigate to="/login" />
    }
  />
  {/* Catch-All: Redirect to Sign In */}
  <Route path="*" element={<Navigate to="/" />} />
</Routes>

    </div>
  );
};

export default App;
