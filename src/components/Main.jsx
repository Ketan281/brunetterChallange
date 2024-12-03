import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getAuth, signOut } from "firebase/auth"
import { toast } from "react-toastify"

const Main = () => {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"))
    if (!storedUser) {
      navigate("/") // Redirect to login if not logged in
    } else {
      setUser(storedUser)
    }
  }, [navigate])

  const handleLogout = async () => {
    const auth = getAuth()
    try {
      await signOut(auth)
      localStorage.removeItem("user")
      toast.success("Logged out successfully!")
      navigate("/") // Redirect to login
    } catch (error) {
      console.error("Error during logout:", error)
      toast.error("Failed to log out. Please try again!")
    }
  }

  return (
    <div className="main-container">
      <nav className="navbar">
        <h1 className="navbar-title">Dashboard</h1>
        {user && (
          <div className="navbar-user">
            <img
              src={user.photo}
              alt="Profile"
              className="navbar-profile-image"
            />
            <span className="navbar-user-name">{user.name}</span>
            <button
              onClick={handleLogout}
              className="navbar-logout-button"
            >
              Logout
            </button>
          </div>
        )}
      </nav>
      <div className="main-content">
        <h2>Welcome, {user?.name}!</h2>
        <p>This is your dashboard. Enjoy exploring!</p>
      </div>
    </div>
  )
}

export default Main
