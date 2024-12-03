import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getAuth, signOut } from "firebase/auth"
import { toast } from "react-toastify"

const Main = () => {
  const [user, setUser] = useState(null)
  const [step, setStep] = useState(1) // Step tracking for multi-phase flow
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

  const redirectToTwitter = () => {
    const twitterText = encodeURIComponent(
      "Proof of brunette selfie (On X). #Proofof$Brunette"
    )
    const twitterUrl = `https://twitter.com/intent/tweet?text=${twitterText}`
    window.open(twitterUrl, "_blank") // Opens Twitter in a new tab
  }

  const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1) // Move to the next step
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="phase-content">
            <h2>Phase 1: Eligibility for Merch</h2>
            <p>
              To proceed, complete the following steps:
            </p>
            <ol>
              <li>
                Post a selfie with the hashtag: <strong>#ProofOf$Brunette</strong> on X.
              </li>
              <li>
                Follow us on social media: <strong>BrunetteBrigade</strong> and <strong>Coi_NFT</strong>.
              </li>
            </ol>
            <p>Click the button below to post your tweet:</p>
            <button className="next-button" onClick={redirectToTwitter}>
              Post on X
            </button>
            <button className="next-button" onClick={handleNextStep}>
              I’ve Completed This Step
            </button>
          </div>
        )
      case 2:
        return (
          <div className="phase-content">
            <h2>Phase 2: Shipping Details</h2>
            <p>Enter your shipping details to receive your merch.</p>
            <button className="next-button" onClick={handleNextStep}>
              Continue
            </button>
          </div>
        )
      default:
        return (
          <div className="phase-content">
            <h2>Thank You!</h2>
            <p>You have completed all the steps. Enjoy your merch!</p>
          </div>
        )
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
        {renderStepContent()} {/* Render the step content */}
      </div>
    </div>
  )
}

export default Main
