import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { API_GET, API_POST } from "./api";
import NavbarUser from "./NavbarUser.js";
import Avatar from "./Avatar";  // Import Avatar
import "./PetSelect.css";

function PetSelect() {
  const userID = localStorage.getItem("userID");
  const [petTypes, setPetTypes] = useState([]);
  const [currentPetTypeID, setCurrentPetTypeID] = useState(
    localStorage.getItem("petTypeID")
  );
  const [currentPet, setCurrentPet] = useState(null);  // Store current pet object
  const [activeHats, setActiveHats] = useState([]);
  const [activeClothes, setActiveClothes] = useState([]);
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
      } catch (error) {
        console.error("Error fetching active items:", error);
      } 
    };

    fetchActiveItems();
  }, [userID]);
  useEffect(() => {
    const fetchPetTypes = async () => {
      try {
        const petTypesResponse = await API_GET("pettype");
        setPetTypes(petTypesResponse.data);

        const savedPetTypeID = localStorage.getItem("petTypeID");
        if (savedPetTypeID) {
          const selectedPet = petTypesResponse.data.find(
            (pet) => pet.petTypeID === parseInt(savedPetTypeID)
          );
          if (selectedPet) {
            setCurrentPet(selectedPet);  // Set the current selected pet object
          }
        } else {
          const userResponse = await API_GET(`user/${userID}`);
          if (userResponse.data && userResponse.data.petTypeID) {
            const userPetTypeID = userResponse.data.petTypeID;
            setCurrentPetTypeID(userPetTypeID);
            localStorage.setItem("petTypeID", userPetTypeID);

            const selectedPet = petTypesResponse.data.find(
              (pet) => pet.petTypeID === userPetTypeID
            );
            if (selectedPet) {
              setCurrentPet(selectedPet);  // Set the current selected pet object
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchPetTypes();
  }, [userID]);

  const handlePetTypeChange = async (newPetTypeID) => {
    if (currentPetTypeID === newPetTypeID) {
      console.log("เลือก pet type นี้อยู่แล้ว");
      return;
    }

    try {
      const response = await API_POST("updatePetType", {
        userID: userID,
        petTypeID: newPetTypeID,
      });
      console.log("อัปเดต pet type:", response.message);

      localStorage.setItem("petTypeID", newPetTypeID);
      setCurrentPetTypeID(newPetTypeID);

      const selectedPet = petTypes.find(
        (pet) => pet.petTypeID === newPetTypeID
      );
      if (selectedPet) {
        setCurrentPet(selectedPet);  // Update the current selected pet object
      }
    } catch (error) {
      console.error("Error updating pet type:", error);
    }
  };

  return (
    <div className="container absolute inset-x-0 top-0">
      <NavbarUser />
      <div className="row flex justify-center">
        <div className="col-md-auto text-center">
          <div>
            สัตว์เลี้ยงของคุณ:{" "}
            {currentPet ? `${currentPet.petName}` : "ยังไม่ได้เลือก"}
          </div>
        </div>
      </div>
      <div className="row flex justify-center">
        {petTypes.map((pet) => (
          <div className={`col-md-auto mx-20`} key={pet.petTypeID}>
            <div className="text-center">
              <img
                src={`http://localhost:3001/img/Pets/${pet.petImg}`}
                alt={pet.petName}
                className="img-fluid"
              />
              <button
                type="button"
                className="btn btn-selectpet m-2"
                onClick={() => handlePetTypeChange(pet.petTypeID)}
                disabled={currentPetTypeID === pet.petTypeID}
              >
                {currentPetTypeID === pet.petTypeID ? "เลือกอยู่" : pet.petName}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* แสดง Avatar และส่งข้อมูลสัตว์เลี้ยงที่เลือก */}
      <Avatar activeHats={activeHats} activeClothes={activeClothes} activePet={currentPet}/>
      {/* <Avatar  activePet={currentPet} /> */}
    </div>
  );
}

export default PetSelect;
