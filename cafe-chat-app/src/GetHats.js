import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { API_GET, API_POST } from "./api.js";
import NavbarUser from "./NavbarUser.js";
import Seller from "./img/Shop/seller.png";
import modelAvatar from "./img/Shop/model.png";
import { useNavigate } from "react-router-dom";
import Avatar from "./Avatar.js";

export default function GetHats() {
  const userID = localStorage.getItem("userID");
  const [userHats, setUserHats] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserHats = async () => {
      try {
        const response = await API_GET(`hatdetailuser/${userID}`);
        if (response.result) {
          setUserHats(response.data);
        } else {
          console.error("Failed to fetch user hats.");
        }
      } catch (error) {
        console.error("Error fetching user hats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserHats();
  }, [userID]);

  const handleHatActive = async (hatID) => {
    try {
      const response = await API_POST("updateHatStatus", { userID, hatID });
      if (response.result) {
        // Update the userHats state locally
        const updatedHats = userHats.map((hat) =>
          hat.hatID === hatID
            ? { ...hat, hat_active: "y" }
            : { ...hat, hat_active: "n" }
        );
        setUserHats(updatedHats);
      }
    } catch (error) {
      console.error("Error updating hat status:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container absolute inset-x-0 top-0">
      <NavbarUser />

      <div className="container text-center">
        <div className="row px-32">
          <div className="col ">
            <img
              src={Seller}
              alt="Shop Background"
              className="img-fluid w-60 rounded mx-auto d-block "
            />
          </div>
          <div className="col text-center">
            <h1>แต่งตัว</h1>
            <h2>สวมหมวก</h2>
          </div>
          <div className="col text-center">
            <div className="avatar-container">
              <Avatar
                activeHats={userHats.filter((hat) => hat.hat_active === "y")}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4 px-36">
        <div className="col ">
          <button className="btn btn-primary mx-2 w-32" disabled>
            หมวก
          </button>
          <button
            className="btn btn-primary mx-2 w-32"
            onClick={() => navigate("/getdressed")}
          >
            เสื้อผ้า
          </button>
        </div>
      </div>

      <div className="card p-4 mx-32 mb-4">
        <div className="row ">
          {userHats.length > 0 ? (
            userHats.map((hat) => (
              <div key={hat.hatID}>
                <div>Hat ID: {hat.hatID}</div>
                <div>Hat Name: {hat.hatName}</div>
                <div className="avatar-container">
                  <img
                    src={modelAvatar}
                    alt="Model Avatar"
                    className="avatar-image"
                  />
                  <img
                    src={`http://localhost:3001/img/hat/${hat.hatImg}`}
                    alt="Hat"
                    className="hat-image"
                  />
                </div>
                {/* Button to activate the hat */}
                <button onClick={() => handleHatActive(hat.hatID)}>
                  {hat.hat_active === "y" ? "สวมแล้ว" : "สวมหมวก"}
                </button>
                <div>----------------------------------------</div>
              </div>
            ))
          ) : (
            <p>คุณยังไม่ได้ซื้อหมวกใด ๆ</p>
          )}
        </div>
      </div>
    </div>
  );
}
