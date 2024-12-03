import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getAuth, signOut } from "firebase/auth"
import { toast } from "react-toastify"
import g from "../assets/rakshita.jpg"
import b from "../assets/angad.jpg"

const Main = () => {
  const [user, setUser] = useState(null)
  const [step, setStep] = useState(1) // Step tracking for multi-phase flow
  const [selectedCreators, setSelectedCreators] = useState([]) // Track selected creators for Step 2
  const [showBio, setShowBio] = useState(null) // Control which bio is shown
  const [showPopup, setShowPopup] = useState(false) // Show the "Thanks for posting" popup

  const navigate = useNavigate()

  const creators = [
    { name: "Rakshita", bio: "Rakshita is a talented digital artist specializing in NFT designs.", photo: g },
    { name: "Angad", bio: "Angad is a developer and NFT enthusiast with a knack for blockchain tech.", photo: b },
    { name: "Abverse", bio: "Abverse creates unique 3D art and immersive metaverse experiences.", photo: b },
    { name: "Deepakshi", bio: "Deepakshi is an AI researcher and digital creator with a passion for community building.", photo: g },
    { name: "Wafu", bio: "Wafu is a cartoonist and illustrator known for quirky, lovable characters.", photo: b },
    { name: "Harsh", bio: "Harsh specializes in generative art and pushing the boundaries of creative coding.", photo: b },
    { name: "Gayatri", bio: "Gayatri is an award-winning photographer capturing vibrant stories through her lens.", photo: g },
  ]

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

  const redirectToTwitter = (postText) => {
    const twitterText = encodeURIComponent(postText)
    const twitterUrl = `https://twitter.com/intent/tweet?text=${twitterText}`
    window.open(twitterUrl, "_blank") // Opens Twitter in a new tab
  }

  const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1) // Move to the next step
    setShowPopup(false) // Hide the popup when proceeding to the next step
  }

  const toggleBio = (creator) => {
    setShowBio(showBio === creator ? null : creator) // Toggle bio visibility
  }

  const renderStepContent = () => {
    if (step === 1) {
      return (
        <div className="phase-content">
          <h2>Phase 1: Eligibility for Merch</h2>
          <p>
            To proceed, post a selfie with the hashtag: <strong>#ProofOf$Brunette</strong> on X.
          </p>
          <button
            className="next-button"
            onClick={() => redirectToTwitter("Proof of brunette selfie (On X). #Proofof$Brunette")}
          >
            Post on X
          </button>
          <button className="next-button" onClick={() => setShowPopup(true)}>
            Completed This Step
          </button>
        </div>
      )
    } else if (step === 2) {
      return (
        <div className="phase-content">
          <h2>Phase 2: Eligibility for Grand Prize of 10 Million $Brunette</h2>
          <p>
            Quest: Interact with our creators and get a #ProofOfBrunette selfie with any 3 of the following creators:
          </p>
          <ul className="creator-list">
            {creators.map((creator) => (
              <li key={creator.name} className="creator-item">
                <div className="creator-header">
                  <img src={creator.photo} alt={creator.name} className="creator-photo" />
                  <span className="creator-name">{creator.name}</span>
                  <button className="bio-toggle" onClick={() => toggleBio(creator.name)}>
                    {showBio === creator.name ? "Hide Bio" : "View Bio"}
                  </button>
                  <button
                    className="post-button"
                    onClick={() => redirectToTwitter(`#ProofOfBrunette Selfie with ${creator.name}!`)}
                  >
                    Post Selfie
                  </button>
                  <input
                    type="checkbox"
                    checked={selectedCreators.includes(creator.name)}
                    onChange={() =>
                      setSelectedCreators((prev) =>
                        prev.includes(creator.name)
                          ? prev.filter((c) => c !== creator.name)
                          : [...prev, creator.name]
                      )
                    }
                  />
                </div>
                {showBio === creator.name && <p className="creator-bio">{creator.bio}</p>}
              </li>
            ))}
          </ul>
          <button
            className="next-button"
            onClick={() => setShowPopup(true)}
            disabled={selectedCreators.length < 3} // Enable only if 3 creators are selected
          >
            Completed This Step
          </button>
        </div>
      )
    } else if (step === 3) {
      return (
        <div className="phase-content">
          <h2>Phase 3: Support Living Artists</h2>
          <p>
            Post a video or photo with the hashtag <strong>#SupportLivingArtists</strong> on X.
          </p>
          <button
            className="next-button"
            onClick={() => redirectToTwitter("Supporting living artists! Here’s my photo/video. #SupportLivingArtists")}
          >
            Post on X
          </button>
          <button className="next-button" onClick={() => setShowPopup(true)}>
            Completed This Step
          </button>
        </div>
      )
    } else {
      return (
        <div className="hurray-screen">
          <h2>Hurray!</h2>
          <p>
            You are now entered for our 10 Million <strong>$Brunette</strong> grand prize!
          </p>
        </div>
      )
    }
  }

  return (
    <div className="main-container">
      <nav className="navbar">
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
      <div className="main-content">{renderStepContent()}</div>

      {/* Popup */}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Thanks for posting!</h2>
            <button className="popup-cancel-button" onClick={handleNextStep}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Main
