import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { toast } from "react-toastify";

const Main = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/"); // Redirect to login if not logged in
    } else {
      setUser(storedUser);
    }
  }, [navigate]);

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      localStorage.removeItem("user");
      toast.success("Logged out successfully!");
      navigate("/"); // Redirect to login
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Failed to log out. Please try again!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-800 to-purple-600 flex items-center justify-center text-white">
      {user && (
        <div className="bg-white rounded-lg shadow-lg p-6 text-gray-800 w-80">
          <div className="flex items-center mb-4">
            <img
              src={user.photo}
              alt="Profile"
              className="w-16 h-16 rounded-full border-2 border-indigo-500"
            />
            <div className="ml-4">
              <h2 className="text-xl font-bold text-indigo-700">
                {user.name}
              </h2>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full py-2 px-4 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold"
          >
            Logout
          </button>
        </div>
      )}

      {/* <p>Hello</p> */}
    </div>
  );
};

export default Main;
