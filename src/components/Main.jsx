import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getAuth, signOut } from "firebase/auth"
import { toast } from "react-toastify"
import g from "../assets/rakshita.jpg"
import b from "../assets/angad.jpg"
const Main = () => {
  const [user, setUser] = useState(null)
  const [step, setStep] = useState(1) // Step tracking for multi-phase flow
  const [selectedCreators, setSelectedCreators] = useState([]) // Track selected creators
  const [showBio, setShowBio] = useState(null) // Control which bio is shown

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

  const creators = [
    { name: "Rakshita", bio: "Rakshita is a talented digital artist specializing in NFT designs.", photo: g },
    { name: "Angad", bio: "Angad is a developer and NFT enthusiast with a knack for blockchain tech.", photo: b },
    { name: "Abverse", bio: "Abverse creates unique 3D art and immersive metaverse experiences.", photo: b },
    { name: "Deepakshi", bio: "Deepakshi is an AI researcher and digital creator with a passion for community building.", photo: g },
    { name: "Wafu", bio: "Wafu is a cartoonist and illustrator known for quirky, lovable characters.", photo: b },
    { name: "Harsh", bio: "Harsh specializes in generative art and pushing the boundaries of creative coding.", photo: b },
    { name: "Gayatri", bio: "Gayatri is an award-winning photographer capturing vibrant stories through her lens.", photo: g },
  ]

  const toggleCreatorSelection = (creator) => {
    if (selectedCreators.includes(creator)) {
      setSelectedCreators(selectedCreators.filter((c) => c !== creator))
    } else {
      setSelectedCreators([...selectedCreators, creator])
    }
  }

  const toggleBio = (creator) => {
    setShowBio(showBio === creator ? null : creator) // Toggle bio visibility
  }

  const redirectToTwitter = () => {
    const twitterText = encodeURIComponent(
      `I just completed my quest with ${selectedCreators.join(", ")}! Here's my #ProofOfBrunette selfie with them!`
    )
    const twitterUrl = `https://twitter.com/intent/tweet?text=${twitterText}`
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
          <button className="next-button" onClick={() => window.open("https://twitter.com/intent/tweet?text=Proof%20of%20brunette%20selfie%20(On%20X).%20#Proofof$Brunette", "_blank")}>
            Post on X
          </button>
          <button className="next-button" onClick={handleNextStep}>
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
                  <input
                    type="checkbox"
                    checked={selectedCreators.includes(creator.name)}
                    onChange={() => toggleCreatorSelection(creator.name)}
                  />
                </div>
                {showBio === creator.name && <p className="creator-bio">{creator.bio}</p>}
              </li>
            ))}
          </ul>
          <button
            className="complete-button"
            onClick={redirectToTwitter}
            disabled={selectedCreators.length < 3} // Disable until 3 creators are selected
          >
            Complete Quest
          </button>
        </div>
      )
    }
  }

  return (
    <div className="main-container">
      <nav className="navbar">
        {/* <h1 className="navbar-title">Dashboard</h1> */}
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
