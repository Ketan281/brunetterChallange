import React, { useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, TwitterAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import X from "../assets/x.png";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCQwkoypG6Hj_uu6WJZlKbDdzJmAc_tp8E",
  authDomain: "brunnette-3be37.firebaseapp.com",
  projectId: "brunnette-3be37",
  storageBucket: "brunnette-3be37.firebasestorage.app",
  messagingSenderId: "873470795864",
  appId: "1:873470795864:web:94d5f19cad5ff0ef1baa2d",
  measurementId: "G-9E8J1WVH5M",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new TwitterAuthProvider();

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userData = {
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
      };
      localStorage.setItem("user", JSON.stringify(userData));
      toast.success("Logged in successfully!");
      navigate("/main"); // Redirect to the main page
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("Failed to log in. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-800 flex items-center justify-center text-white">
      <div className="bg-white rounded-lg shadow-lg p-6 text-gray-800 w-80">
        <h1 className="text-2xl font-bold text-center text-indigo-700 mb-4">
          Welcome Back!
        </h1>
        <p className="text-sm text-center text-gray-500 mb-6">
          Log in to access your dashboard.
        </p>
        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full py-2 px-4 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold flex items-center justify-center gap-2 ${
            loading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
          }`}
          style={{
            display:"flex",
            alignItems:"Center",
            gap:10
          }}
        >
          <img
            src={X}
            height={30}
            width={30}
            alt="Twitter"
            className="h-6 w-6"
          />
          <p style={{display:"inline"}}>{loading ? "Logging in..." : "Login with Twitter"}</p>
        </button>
      </div>
    </div>
  );
};

export default Login;
