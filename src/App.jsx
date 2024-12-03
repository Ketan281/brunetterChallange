import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Main from "./components/Main";
import { ToastContainer } from "react-toastify";
import "./App.css"
const App = () => {
  // Check if the user is already logged in
  const isAuthenticated = !!localStorage.getItem("user");

  return (
    <div>
      <ToastContainer />
      <Routes>
        {/* Default Route: Sign In */}
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/main" /> : <Login />
          }
        />
        {/* Main Route: Protected */}
        <Route
          path="/main"
          element={
            isAuthenticated ? <Main /> : <Navigate to="/" />
          }
        />
        {/* Catch-All: Redirect to Sign In */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

export default App;
