import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AiFillEdit } from "react-icons/ai";
import { FaCirclePlay } from "react-icons/fa6";
import { API_POST } from "./api"; // ใช้ฟังก์ชัน API_POST จาก api.js

import bgHome from "./img/Home/bgHome.png";

import "./Home.css";
import NavbarUser from "./NavbarUser.js";

function Home() {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(
    localStorage.getItem("displayName")
  );
  const [newDisplayName, setNewDisplayName] = useState(displayName);
  const [isInputClicked, setIsInputClicked] = useState(false);

  const userID = localStorage.getItem("userID");

  const handleInputChange = (e) => {
    setNewDisplayName(e.target.value);
  };

  const handleSaveClick = async () => {
    try {
      // Send updated displayName to the server
      const response = await API_POST("updateDisplayName", {
        displayName: newDisplayName,
        userID,
      });

      if (response.success) {
        // Update localStorage with the new displayName
        localStorage.setItem("displayName", newDisplayName);
        setDisplayName(newDisplayName);
        setIsEditing(true);

        setIsInputClicked(false); // Reset input click state
      } else {
        console.error("Failed to update displayName:", response.message);
      }
    } catch (error) {
      console.error("Error while updating displayName:", error);
    }
  };

  const handleInputClick = () => {
    setIsInputClicked(true); // Set input clicked to true when input is clicked
  };

  useEffect(() => {
    const loadData = () => {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    };

    loadData();
  }, []);

  if (loading) {
    return <h3 className="text-center">รอสักครู่นะคะ...</h3>;
  }

  return (
    <div>
      <div className="container absolute inset-x-0 top-0">
        <NavbarUser />
        <div>
          <Link className="button-cloth" to="/dressup">
            แต่งตัว
          </Link>
        </div>
        <Link className="button-shop" to="/shophat">
          ร้านค้า
        </Link>
        <Link className="button-pet" to="/petselect">
          สัตว์เลี้ยง
        </Link>

        <div>
          <AiFillEdit className="edit-displayName" onClick={handleInputClick} />
          <div className="displayName-edit">
            <input
              type="text"
              value={newDisplayName}
              onChange={handleInputChange}
              className="w-52 ml-4 mr-1 fs-3"
              onClick={handleInputClick} // Detect input click
            />
            {isInputClicked && ( // Show the Save button only if input is clicked
              <button onClick={handleSaveClick}>Save</button>
            )}
          </div>
        </div>

        <div>
          <Link to={"/chatroom"}>
            <FaCirclePlay className="button-play" />
          </Link>
        </div>
        <img src={bgHome} className="mt-2 w-full" alt="bgHome" />
      </div>
    </div>
  );
}

export default Home;
