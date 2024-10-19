import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { API_GET, API_POST } from "./api.js";
import NavbarUser from "./NavbarUser.js";
import Seller from "./img/Shop/seller.png";
import modelAvatar from "./img/Shop/model.png";
import { useNavigate } from "react-router-dom";
// import "./GetDressed.css";
import Avatar from "./Avatar.js";

export default function GetDressed() {
  const userID = localStorage.getItem("userID");
  const [userClothes, setUserClothes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserClothes = async () => {
      try {
        const response = await API_GET(`clothdetailuser/${userID}`);

        if (response.result) {
          setUserClothes(response.data);
        } else {
          console.error("Failed to fetch user clothes.");
        }
      } catch (error) {
        console.error("Error fetching user clothes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserClothes();
  }, [userID]);

  const handleClothActive = async (clothID) => {
    try {
      const response = await API_POST("updateclothStatus", { userID, clothID });
      if (response.result) {
        // Update the usercloths state locally
        const updatedClothes = userClothes.map((cloth) =>
          cloth.clothID === clothID
            ? { ...cloth, cloth_active: "y" }
            : { ...cloth, cloth_active: "n" }
        );
        setUserClothes(updatedClothes);
      }
    } catch (error) {
      console.error("Error updating cloth status:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container absolute inset-x-0 top-0">
      <NavbarUser />

      {/* Row 1: Avatar and Shop Name */}
      <div className="container text-center">
        <headers className="row px-32">
          <div className="col ">
            <img
              src={Seller}
              alt="Shop Background"
              className="img-fluid w-60 rounded mx-auto d-block "
            />
          </div>
          <div className="col text-center">
            <h1>แต่งตัว</h1>
            <h2>สวมเสื้อผ้า</h2>
          </div>
          <div className="col text-center">
            <div className="avatar-container">
              <Avatar
                activeClothes={userClothes.filter((cloth) => cloth.cloth_active === "y")}
              />
            </div>
          </div>
        </headers>
      </div>

      {/* Row 2: Category Buttons */}
      <div className="row mb-4 px-36">
        <div className="col ">
          <button
            className="btn btn-primary mx-2 w-32"
            onClick={() => navigate("/gethats")}
          >
            หมวก
          </button>
          <button className="btn btn-primary mx-2 w-32" disabled>
            เสื้อผ้า
          </button>
        </div>
      </div>

      {/* Row 3: List of Clothes */}
      <div className="card p-4 mx-32 mb-4">
        <div className="row ">
          {userClothes.length > 0 ? (
            <div>
              {userClothes.map((cloth) => {
                console.log("Current cloth Object:", cloth); // Log the current cloth object
                return (
                  <div key={cloth.clothID}>
                    <div>Cloth ID: {cloth.clothID}</div>
                    <div>Cloth Name: {cloth.clothName}</div>
                    <div className="avatar-container">
                      {/* Model Avatar */}
                      <img
                        src={modelAvatar}
                        alt="Model Avatar"
                        className="avatar-image"
                      />
                      {/* Cloth Item */}
                      <img
                        src={`http://localhost:3001/img/Clothes/${cloth.clothImg}`}
                        alt="Cloth"
                        className="cloth-image"
                      />
                    </div>
                    {/* Button to activate the cloth */}
                    <button onClick={() => handleClothActive(cloth.clothID)}>
                      {cloth.cloth_active === "y" ? "สวมแล้ว" : "สวมหมวก"}
                    </button>
                    <div>----------------------------------------</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p>คุณยังไม่ได้ซื้อเสื้อผ้าใด ๆ</p> // Message if no clothes are purchased
          )}
        </div>
      </div>
    </div>
  );
}
