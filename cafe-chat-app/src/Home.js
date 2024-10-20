import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AiFillEdit } from "react-icons/ai";
import { FaCirclePlay } from "react-icons/fa6";
import { API_POST, API_GET } from "./api"; // ใช้ฟังก์ชัน API_POST จาก api.js

import bgHome from "./img/Home/bgHome.png";

import "./Home.css";
import NavbarUser from "./NavbarUser.js";
import Avatar from "./Avatar.js";

function Home() {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(
    localStorage.getItem("displayName")
  );
  const [newDisplayName, setNewDisplayName] = useState(displayName);
  const [isInputClicked, setIsInputClicked] = useState(false);

  const userID = localStorage.getItem("userID");
  const [activeHats, setActiveHats] = useState([]);
  const [activeClothes, setActiveClothes] = useState([]);
  const [currentPet, setCurrentPet] = useState(null); // Store current pet object

  useEffect(() => {
    const fetchActiveItems = async () => {
      try {
        // Fetch active hats
        const hatsResponse = await API_GET(`hatdetailuser/${userID}`);
        if (hatsResponse.result) {
          const activeHats = hatsResponse.data.filter(
            (hat) => hat.hat_active === "y"
          );
          setActiveHats(activeHats);
        }

        // Fetch active clothes
        const clothesResponse = await API_GET(`clothdetailuser/${userID}`);
        if (clothesResponse.result) {
          const activeClothes = clothesResponse.data.filter(
            (cloth) => cloth.cloth_active === "y"
          );
          setActiveClothes(activeClothes);
        }

        // Fetch selected pet
        const petTypeID = localStorage.getItem("petTypeID");
        if (petTypeID) {
          const petResponse = await API_GET("pettype");
          if (petResponse.result) {
            const selectedPet = petResponse.data.find(
              (pet) => pet.petTypeID === parseInt(petTypeID)
            );
            if (selectedPet) {
              setCurrentPet(selectedPet); // Set the current selected pet object
            }
          }
        }
      } catch (error) {
        console.error("Error fetching active items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveItems();
  }, [userID]);

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
          <Link className="button-cloth" to="/gethats">
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
          <AiFillEdit className=" edit-displayName" onClick={handleInputClick} />
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
        {/* <Avatar activePet={currentPet} /> */}
        <div className="absolute top-80 inset-x-0 ">
          <div className="absolute inset-x-1/3 top-14">
            {/* ส่งข้อมูล activePet ที่ได้จากการดึงมา */}
            <Avatar
              className="custom-home-avatar-class"
              activeHats={activeHats}
              activeClothes={activeClothes}
              activePet={currentPet}
            />
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
