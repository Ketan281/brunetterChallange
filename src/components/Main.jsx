import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { toast } from "react-toastify";
import g from "../assets/rakshita.jpg";
import b from "../assets/angad.jpg";

const Main = ({ onLogout }) => {
  const [user, setUser] = useState(null);
  const [step, setStep] = useState(1); // Step tracking
  const [completedPhases, setCompletedPhases] = useState([]);
  const [selectedCreators, setSelectedCreators] = useState([]);
  const [showBio, setShowBio] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/"); // Redirect to login if not logged in
    } else {
      setUser(storedUser);

      // Load completed phases from localStorage
      const savedPhases = JSON.parse(localStorage.getItem("completedPhases")) || {};
      setCompletedPhases(savedPhases[storedUser.email] || []);
    }
  }, [navigate]);

  const creators = [
    { name: "Rakshita", bio: "Digital artist specializing in NFT designs.", photo: g },
    { name: "Angad", bio: "Developer and NFT enthusiast.", photo: b },
    { name: "Abverse", bio: "Creates unique 3D art.", photo: b },
    { name: "Deepakshi", bio: "AI researcher and digital creator.", photo: g },
    { name: "Wafu", bio: "Cartoonist known for quirky characters.", photo: b },
    { name: "Harsh", bio: "Specializes in generative art.", photo: b },
    { name: "Gayatri", bio: "Award-winning photographer.", photo: g },
  ];

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      localStorage.removeItem("user");
      onLogout();
    } catch (error) {
      toast.error("Failed to log out. Please try again!");
    }
  };

  const redirectToTwitter = (postText, creatorName = null) => {
    const twitterText = encodeURIComponent(postText);
    const twitterUrl = `https://twitter.com/intent/tweet?text=${twitterText}`;
    window.open(twitterUrl, "_blank");

    if (creatorName) {
      setSelectedCreators((prev) =>
        prev.includes(creatorName) ? prev : [...prev, creatorName]
      );
    }
  };

  const completePhase = () => {
    const updatedPhases = [...completedPhases, step];
    setCompletedPhases(updatedPhases);

    // Save updated phases to localStorage
    const savedPhases = JSON.parse(localStorage.getItem("completedPhases")) || {};
    savedPhases[user.email] = updatedPhases;
    localStorage.setItem("completedPhases", JSON.stringify(savedPhases));

    setStep((prevStep) => prevStep + 1); // Move to the next phase
    setShowPopup(false);
  };

  const toggleBio = (creator) => {
    setShowBio(showBio === creator ? null : creator);
  };

  const renderStepContent = () => {
    if (step === 1) {
      return (
        <div className="phase-content">
          <h2>Phase 1: Eligibility for Merch</h2>
          <p>Post a selfie with the hashtag: <strong>#ProofOf$Brunette</strong> on X.</p>
          <button
            className="next-button"
            onClick={() => redirectToTwitter("Proof of brunette selfie (On X). #Proofof$Brunette")}
          >
            Post on X
          </button>
          <button
            className="next-button"
            onClick={() => {
              setPopupMessage("Thanks for posting!");
              setShowPopup(true);
            }}
          >
            Completed This Step
          </button>
        </div>
      );
    } else if (step === 2) {
      return (
        <div className="phase-content">
          <h2>Phase 2: Eligibility for Grand Prize</h2>
          <p>Interact with our creators and get a selfie with any 3 creators:</p>
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
                    onClick={() =>
                      redirectToTwitter(`#ProofOfBrunette Selfie with ${creator.name}!`, creator.name)
                    }
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
            className="next-button"
            onClick={() => {
              setPopupMessage("Thanks for posting!");
              setShowPopup(true);
            }}
            disabled={selectedCreators.length < 3}
          >
            Completed This Step
          </button>
        </div>
      );
    } else if (step === 3) {
      return (
        <div className="phase-content">
          <h2>Phase 3: Support Living Artists</h2>
          <p>Post a video or photo with the hashtag <strong>#SupportLivingArtists</strong> on X.</p>
          <button
            className="next-button"
            onClick={() =>
              redirectToTwitter("Supporting living artists! Here’s my photo/video. #SupportLivingArtists")
            }
          >
            Post on X
          </button>
          <button
            className="next-button"
            onClick={() => {
              setPopupMessage("Thanks for posting!");
              setShowPopup(true);
            }}
          >
            Completed This Step
          </button>
        </div>
      );
    } else {
      return (
        <div className="hurray-screen">
          <h2>Hurray!</h2>
          <p>You are now entered for our grand prize!</p>
        </div>
      );
    }
  };

  return (
    <div className="main-container">
      <nav className="navbar">
        {user && (
          <div className="navbar-user">
            <img src={user.photo} alt="Profile" className="navbar-profile-image" />
            <span className="navbar-user-name">{user.name}</span>
            <button onClick={handleLogout} className="navbar-logout-button">Logout</button>
          </div>
        )}
      </nav>
      <div className="main-content">
        <div className="completed-phases">
          <h3>Completed Phases:</h3>
          <ul>
            {completedPhases.map((phase) => (
              <li key={phase}>Phase {phase}</li>
            ))}
          </ul>
        </div>
        {renderStepContent()}
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>{popupMessage}</h2>
            <button className="popup-cancel-button" onClick={completePhase}>Proceed</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Main;
