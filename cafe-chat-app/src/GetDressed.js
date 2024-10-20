import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { API_GET, API_POST } from "./api.js";
import NavbarUser from "./NavbarUser.js";
import Seller from "./img/Shop/seller.png";
import modelAvatar from "./img/Shop/model.png";
import { useNavigate } from "react-router-dom";
import Avatar from "./Avatar.js";

export default function GetDressed() {
  const userID = localStorage.getItem("userID");
  const [userClothes, setUserClothes] = useState([]);
  const [userHats, setUserHats] = useState([]); // State สำหรับเก็บข้อมูลหมวก
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [clothesResponse, hatsResponse] = await Promise.all([
          API_GET(`clothdetailuser/${userID}`),
          API_GET(`hatdetailuser/${userID}`), // สมมติว่ามี API สำหรับดึงข้อมูลหมวก
        ]);

        if (clothesResponse.result) {
          setUserClothes(clothesResponse.data);
        } else {
          console.error("Failed to fetch user clothes.");
        }

        if (hatsResponse.result) {
          setUserHats(hatsResponse.data); // เก็บข้อมูลหมวกใน state
        } else {
          console.error("Failed to fetch user hats.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userID]);

  const handleClothActive = async (clothID) => {
    try {
      const response = await API_POST("updateclothStatus", { userID, clothID });
      if (response.result) {
        // Update the userClothes state locally
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
                activeClothes={userClothes.filter(
                  (cloth) => cloth.cloth_active === "y"
                )}
                activeHats={userHats.filter((hat) => hat.hat_active === "y")} // ส่งข้อมูลหมวก
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
        {userClothes.length > 0 ? (
          <div className="container">
            <div className="row row-cols-3">
              {userClothes.map((cloth) => {
                console.log("Current cloth Object:", cloth); // Log the current cloth object
                return (
                  <div className="col md-4">
                    <div className="card m-2 p-2" key={cloth.clothID}>
                      {/* <div>Cloth Name: {cloth.clothName}</div> */}
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
                      <button
                        onClick={() => handleClothActive(cloth.clothID)}
                        disabled={cloth.cloth_active === "y"}
                        className={
                          cloth.cloth_active === "y"
                            ? "btn border-t-pink-400 btn-disabled"
                            : "btn btn-primary"
                        }
                      >
                        {cloth.cloth_active === "y" ? "สวมแล้ว" : "สวมเสื้อผ้า"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p>คุณยังไม่ได้ซื้อเสื้อผ้าใด ๆ</p> // Message if no clothes are purchased
        )}
      </div>
    </div>
  );
}
