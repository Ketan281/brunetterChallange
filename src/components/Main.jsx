import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { toast } from "react-toastify";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
import Papa from "papaparse";
import g from "../assets/rakshita.jpg";
import rakshita from "../assets/rakshita1.jpg";
import b from "../assets/angad.jpg";
import angad from "../assets/angad1.jpg";
import wafu from "../assets/wafu.jpg"
import harsh from "../assets/harsh.jpg"
import deepakshi from "../assets/deepakshi.jpg"
import gayatri from "../assets/gayatri.jpg"
import live from "../assets/live.jpg"
// Initialize Firestore
const db = getFirestore();

const Main = ({ onLogout }) => {
  const [user, setUser] = useState(null);
  const [step, setStep] = useState(1); // Step tracking for multi-phase flow
  const [completedPhases, setCompletedPhases] = useState([]); // Track completed phases
  const [selectedCreators, setSelectedCreators] = useState([]); // Track selected creators for Step 2
  const [showBio, setShowBio] = useState(null); // Control which bio is shown
  const [showPopup, setShowPopup] = useState(false); // Show the "Thanks for posting" popup
  const [popupMessage, setPopupMessage] = useState(""); // Message in the popup

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/"); // Redirect to login if not logged in
    } else {
      setUser(storedUser);

      // Load completed phases from localStorage
      const savedPhases = JSON.parse(localStorage.getItem("completedPhases")) || {};
      const userPhases = savedPhases[storedUser.email] || [];
      setCompletedPhases(userPhases);

      // Determine the next step based on completed phases
      const nextStep = userPhases.length + 1; // If Phase 1 completed, move to Phase 2
      setStep(nextStep);
    }
  }, [navigate]);

  const creators = [
    { name: "Awkquarian", bio: "Awkquarian is a digital artist, web3 creator and the founder of $brunette coin.", photo: rakshita,gen:"f",username:"rakshitaphilip" },
    { name: "Angad", bio: "Angad plays at the intersection of art & technology. He’s the co-founder of COI NFT, set up India’s 1st NFT Gallery, is working on an “ethical vandalism” street art campaign with AR and is obsessed with artist empowerment and storytelling through tech. Talk to him about the Support Living Artists campaign.", photo: angad,gen:"m",username:"angadbsodhi" },
    { name: "Abverse", bio: "Abhishek Bhaskar is a beatboxer, 3D digital artist and award-winning architect from India. He’s best known for creating Metavoice, the world’s first beatboxing generated digital art and he’s also here as your emcee for the night.", photo: b,gen:"m",username:"iamabverse" },
    { name: "Deepakshi", bio: "Deepakshi is an illustrator from Chandigarh. She’s an animal lover best known for her whimsical bunny collection called Nom Nom. Her NFTs have earned her thousands, most of which she’s donated to animal welfare NGOs.", photo: deepakshi,gen:"f",username:"deepakshi_eth" },
    { name: "Wafu", bio: "Dr Wafu, the artist so controversial, that he never leaves home without a mask! Ask him why? ", photo: wafu,gen:"m",username:"wafudraws" },
    { name: "Harsh", bio: "Harsh is a newbie to web3 and is trying to bring off chain creators onchain. p.s. he’s CTO of Qyuki our sponsors for tonight! 😜", photo: harsh,gen:"b",username:"0xSongra" },
    { name: "Gayatri", bio: "Gayatri is a Based BuildHer and Web3 native creator who joined the space just 6 months ago. In this short time, she’s won multiple Base hackathons and minted over 9k NFTs from her collection, Base Colours.", photo: gayatri,gen:"f",username:"gayatri_gt" },
  ];

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      localStorage.removeItem("user");
      onLogout(); // Update App state
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Failed to log out. Please try again!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const redirectToTwitter = (postText, creatorName = null) => {
    const twitterText = encodeURIComponent(postText);
    const twitterUrl = `https://twitter.com/intent/tweet?text=${twitterText}`;
    window.open(twitterUrl, "_blank"); // Opens Twitter in a new tab

    // Automatically mark the creator as selected if provided
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
    setShowPopup(false); // Hide the popup
  };

  const saveUserCompletion = async () => {
    try {
      await addDoc(collection(db, "completedUsers"), {
        email: user.email,
        name: user.name,
        timestamp: new Date().toISOString(),
      });
      console.log("User data saved to Firestore.");
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };
  console.log(":::")
  const completeAllPhases = () => {
    saveUserCompletion(); // Save user data to Firestore
    setPopupMessage("Hurray! You've completed all phases!");
    setShowPopup(true);
  };

  const toggleBio = (creator) => {
    setShowBio(showBio === creator ? null : creator); // Toggle bio visibility
  };

  const downloadCSV = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "completedUsers"));
      const userData = querySnapshot.docs.map((doc) => doc.data());

      // Convert user data to CSV
      const csvData = Papa.unparse(userData);
      const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      // Create a download link
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "completed_users.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading CSV:", error);
    }
  };

  const renderStepContent = () => {
    if (step === 1) {
      return (
        <div className="phase-content">
          <h2>STEP 1: To claim some cutesy merch</h2>
          <p>Post your proof of $brunette on X and tag us</p>
          <button
            className="next-button"
            onClick={() => redirectToTwitter("Proof of $brunette at Pump me up, Buttercup with @brunettesonli @coi_nft 💕")}
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
          <h2>STEP 2: Be eligible to win a grand prize of $50 million</h2>
          <p>Find any three of our $brunette creators here, post a selfie with them on X and tag us 💅🏽✨</p>
          <ul className="creator-list">
            {creators.map((creator) => (
              <li key={creator.name} className="creator-item">
                <div className="creator-header">
                  <img src={creator.photo} alt={creator.name} className="creator-photo" />
                  <span className="creator-name">{creator.name}({creator.username})</span>
                  <button className="bio-toggle" onClick={() => toggleBio(creator.name)}>
                    {showBio === creator.name ? "Hide Bio" : "View Bio"}
                  </button> 
                  <button
                    className="post-button"
                    onClick={() =>
                      redirectToTwitter(`Met $brunette ${creator.gen === "m" ? "King" : "Queen"} ${creator.name}! at pump me up, buttercup today 💅🏽✨`, creator.name)
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
          <h2>Step 3: Support Living Artists</h2>
          <p>Post a video or photo with the hashtag <strong>#SupportLivingArtists</strong> on X.</p>
          <p>We’ve got some fun hidden Augmented Reality Easter eggs in our merch! Spot the ‘Support Living Artists’ message and post something with the AR!</p>
          <div style={{display:"grid",placeItems:"center"}}>
          <img 
          src={live}
          height={100}
          width={100}
          alt="live"
          
          />
          </div>
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
            onClick={() => completeAllPhases()}
          >
            Completed This Step
          </button>
        </div>
      );
    } else {
      return (
        <div className="hurray-screen">
          <h2>Slayyyyy!!!!</h2>
          <p>You are now entered for our 50 Million <strong>$Brunette</strong> grand prize!</p>
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
        <div className="download-csv-container">
          <button onClick={downloadCSV} className="download-csv-button">
            Download Completed Users CSV
          </button>
        </div>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>{popupMessage}</h2>
            <button className="popup-cancel-button" onClick={completePhase}>
              Proceed
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Main;
