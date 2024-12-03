import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Main from "./components/Main";
import { ToastContainer } from "react-toastify";

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
            <Login />
          }
        />
        {/* Main Route: Protected */}
        <Route
          path="/main"
          element={
             <Main /> 
          }
        />
        {/* Catch-All: Redirect to Sign In */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

export default App;
