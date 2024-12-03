import React, { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { getAuth, signOut } from "firebase/auth"
import { toast } from "react-toastify"
import g from "../assets/rakshita.jpg"
import b from "../assets/angad.jpg"

const Main = () => {
  const [user, setUser] = useState(null)
  const [step, setStep] = useState(1) // Step tracking for multi-phase flow
  const [tweetPosted, setTweetPosted] = useState(false) // Track if the user has posted for Step 1
  const [selectedCreators, setSelectedCreators] = useState([]) // Track selected creators for Step 2
  const [showBio, setShowBio] = useState(null) // Control which bio is shown
  const [supportPosted, setSupportPosted] = useState(false) // Track if the user completed Step 3
  const navigate = useNavigate()
  const location = useLocation() // To parse URL parameters

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
    // Check for logged-in user
    const storedUser = JSON.parse(localStorage.getItem("user"))
    if (!storedUser) {
      navigate("/") // Redirect to login if not logged in
    } else {
      setUser(storedUser)
    }

    // Parse URL parameters to check if the user posted on Twitter
    const queryParams = new URLSearchParams(location.search)
    const posted = queryParams.get("step1Posted") // Check if the user completed Step 1
    const postedCreator = queryParams.get("postedCreator") // Check if the user posted about a creator
    const supportCompleted = queryParams.get("supportPosted") // Check if Step 3 is completed

    if (posted === "true") {
      setTweetPosted(true) // Enable the button if they posted on Twitter
    }

    if (postedCreator && creators.find((c) => c.name === postedCreator)) {
      // If creator exists, mark them as selected
      setSelectedCreators((prev) => {
        if (!prev.includes(postedCreator)) {
          return [...prev, postedCreator]
        }
        return prev
      })
    }

    if (supportCompleted === "true") {
      setSupportPosted(true) // Mark Step 3 as completed
    }
  }, [navigate, location.search]) // Runs on URL change

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

  const toggleBio = (creator) => {
    setShowBio(showBio === creator ? null : creator) // Toggle bio visibility
  }

  const redirectToTwitterStep1 = () => {
    const twitterText = encodeURIComponent(
      `Proof of brunette selfie (On X). #Proofof$Brunette`
    )
    const returnUrl = `${window.location.origin}${window.location.pathname}?step1Posted=true` // Add URL parameter
    const twitterUrl = `https://twitter.com/intent/tweet?text=${twitterText}&url=${encodeURIComponent(returnUrl)}`
    window.open(twitterUrl, "_blank") // Opens Twitter in a new tab
  }

  const redirectToTwitterStep3 = () => {
    const twitterText = encodeURIComponent(
      `Supporting living artists! Here’s my photo/video. #SupportLivingArtists`
    )
    const returnUrl = `${window.location.origin}${window.location.pathname}?supportPosted=true` // Add URL parameter
    const twitterUrl = `https://twitter.com/intent/tweet?text=${twitterText}&url=${encodeURIComponent(returnUrl)}`
    window.open(twitterUrl, "_blank") // Opens Twitter in a new tab
  }

  const redirectToTwitter = (creatorName) => {
    const twitterText = encodeURIComponent(
      `#ProofOfBrunette Selfie with ${creatorName}!`
    )
    const returnUrl = `${window.location.origin}${window.location.pathname}?postedCreator=${creatorName}` // Add URL parameter
    const twitterUrl = `https://twitter.com/intent/tweet?text=${twitterText}&url=${encodeURIComponent(returnUrl)}`
    window.open(twitterUrl, "_blank") // Opens Twitter in a new tab
  }

  const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1) // Move to the next step
  }

  const renderStepContent = () => {
    if (step === 1) {
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
          <button className="next-button" onClick={redirectToTwitterStep1}>
            Post on X
          </button>
          <button
            className="next-button"
            onClick={handleNextStep}
            disabled={!tweetPosted} // Disable button until user posts on Twitter
          >
            I’ve Completed This Step
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
                    onClick={() => redirectToTwitter(creator.name)}
                  >
                    Post Selfie
                  </button>
                  <input
                    type="checkbox"
                    checked={selectedCreators.includes(creator.name)}
                    readOnly
                  />
                </div>
                {showBio === creator.name && <p className="creator-bio">{creator.bio}</p>}
              </li>
            ))}
          </ul>
          <button
            className="complete-button"
            onClick={handleNextStep}
            disabled={selectedCreators.length < 3} // Disable until 3 creators are selected
          >
            Complete Quest
          </button>
        </div>
      )
    } else if (step === 3) {
      return (
        <div className="phase-content">
          <h2>Phase 3: Support Living Artists</h2>
          <p>
            To proceed, post a video or photo with the hashtag <strong>#SupportLivingArtists</strong> on X.
          </p>
          <button className="next-button" onClick={redirectToTwitterStep3}>
            Post on X
          </button>
          {supportPosted && (
            <div className="hurray-screen">
              <h2>Hurray!</h2>
              <p>
                You are now entered for our 10 Million <strong>$Brunette</strong> grand prize!
              </p>
            </div>
          )}
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
      <div className="main-content">
        {renderStepContent()} {/* Render the step content */}
      </div>
    </div>
  )
}

export default Main
