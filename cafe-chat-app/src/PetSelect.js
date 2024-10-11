import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { API_GET, API_POST } from "./api";
import NavbarUser from "./NavbarUser.js";
import "./PetSelect.css";

function PetSelect() {
  const userID = localStorage.getItem("userID"); // Ensure you're using userID here
  const petUserID = localStorage.getItem("petTypeID"); // จะนำไปใช้ได้ เช่น ปุ่มที่แสดงว่า userID นี้มีข้อมูล petTypeID ใดอยู่ใน database
  const [petTypes, setPetTypes] = useState([]);
  const [currentPetTypeID, setCurrentPetTypeID] = useState(petUserID); // State to hold current petTypeID

  // Fetch pet types and current user's petTypeID
  useEffect(() => {
    const fetchPetTypes = async () => {
      try {
        // Fetch pet types
        const response = await API_GET("pettype");
        setPetTypes(response.data);

        // Fetch current user's petTypeID
        const userResponse = await API_GET(`user/${userID}`);
        setCurrentPetTypeID(userResponse.data.petTypeID); // Assuming the response contains petTypeID
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchPetTypes();
  }, [userID]);

  // Function to handle button click
  const handlePetTypeChange = async (newPetTypeID) => {
    if (currentPetTypeID === newPetTypeID) {
      console.log("This pet type is already selected.");
      return; // Do nothing if the pet type is already selected
    }

    try {
      // Update pet type in the database
      const response = await API_POST("updatePetType", {
        userID: userID,
        petTypeID: newPetTypeID,
      });
      console.log("Pet type updated:", response.message);

      // Update local storage and state
      localStorage.setItem("petTypeID", newPetTypeID);
      setCurrentPetTypeID(newPetTypeID); // Update state to reflect the change
    } catch (error) {
      console.error("Error updating pet type:", error);
    }
  };

  return (
    <div className="container absolute inset-x-0 top-0">
      <NavbarUser />
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
                className={`btn btn-selectpet m-2 ${
                  currentPetTypeID === pet.petTypeID
                    ? "btn-current "
                    : "btn-default"
                }`}
                onClick={() => handlePetTypeChange(pet.petTypeID)}
              >
                {pet.petName}
              </button>
            </div>
         

          </div>
        ))}
      </div>
    </div>
  );
}

export default PetSelect;
