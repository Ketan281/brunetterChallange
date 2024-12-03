import React, { useState } from "react"
import { initializeApp } from "firebase/app"
import { getAuth, signInWithPopup, TwitterAuthProvider } from "firebase/auth"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import X from "../assets/x.png"

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCQwkoypG6Hj_uu6WJZlKbDdzJmAc_tp8E",
  authDomain: "brunnette-3be37.firebaseapp.com",
  projectId: "brunnette-3be37",
  storageBucket: "brunnette-3be37.firebasestorage.app",
  messagingSenderId: "873470795864",
  appId: "1:873470795864:web:94d5f19cad5ff0ef1baa2d",
  measurementId: "G-9E8J1WVH5M",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const provider = new TwitterAuthProvider()

const Login = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async () => {
    setLoading(true)
    try {
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      const userData = {
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
      }
      localStorage.setItem("user", JSON.stringify(userData))
  
  
      navigate("/main") // Redirect to /main after login
    } catch (error) {
      console.error("Error during login:", error)
      toast.error("Failed to log in. Please try again!", {
        position: "top-right",
        autoClose: 3000,
      })
    } finally {
      setLoading(false)
    }
  }
  

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Welcome Back!</h1>
          <p>Log in to access your personalized dashboard.</p>
        </div>
        <button
          onClick={handleLogin}
          disabled={loading}
          className="login-button"
        >
          <img src={X} alt="Twitter" />
          {loading ? "Logging in..." : "Login with Twitter"}
        </button>
      </div>
    </div>
  )
}

export default Login
