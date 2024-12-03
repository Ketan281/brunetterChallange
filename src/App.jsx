import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, TwitterAuthProvider, signOut } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCQwkoypG6Hj_uu6WJZlKbDdzJmAc_tp8E",
  authDomain: "brunnette-3be37.firebaseapp.com",
  projectId: "brunnette-3be37",
  storageBucket: "brunnette-3be37.firebasestorage.app",
  messagingSenderId: "873470795864",
  appId: "1:873470795864:web:94d5f19cad5ff0ef1baa2d",
  measurementId: "G-9E8J1WVH5M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new TwitterAuthProvider();

const App = () => {
  const [user, setUser] = useState(null);

  // Handle login with Twitter
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = TwitterAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const secret = credential.secret;
      const user = result.user;
      setUser({
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
      });
      localStorage.setItem("user", JSON.stringify(user));
      alert("Logged in successfully!");
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    localStorage.removeItem("user");
    alert("Logged out!");
  };

  // Check for logged-in user on page load
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {!user ? (
        <div>
          <h1>Welcome to Brunette Challenge</h1>
          <button
            onClick={handleLogin}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#1DA1F2",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Login with Twitter
          </button>
        </div>
      ) : (
        <div>
          <h1>Welcome, {user.name}!</h1>
          <img src={user.photo} alt="Profile" style={{ borderRadius: "50%", width: "100px" }} />
          <p>Your email: {user.email}</p>
          <button
            onClick={handleLogout}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#FF4500",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
