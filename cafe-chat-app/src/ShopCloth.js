import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import NavbarUser from "./NavbarUser";
import { API_GET, API_POST } from "./api"; // Import API_GET and API_POST
import bgShop from "./img/Shop/bgShop.png";
import modelAvatar from "./img/Shop/model.png";
import coinicon from "./img/Shop/coin.png";
import { useNavigate } from "react-router-dom";

import "./ShopCloth.css";

function ShopCloth() {
  const navigate = useNavigate();
  const [clothes, setClothes] = useState([]); // State to store clothes
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [showModal, setShowModal] = useState(false);
  const [selectedCloth, setSelectedCloth] = useState(null);
  const userID = localStorage.getItem("userID"); // Get userID from localStorage
  const [userCoins, setUserCoins] = useState(localStorage.getItem("coin") || 0); // State for user coins
  const [showCoinsModal, setShowCoinsModal] = useState(false);

  const [userClothes, setUserClothes] = useState([]); // State for user clothes

  useEffect(() => {
    const fetchUserClothes = async () => {
      const response = await API_GET(`usercloth/${userID}`);
      if (response.result) {
        setUserClothes(response.data.map((cloth) => cloth.clothID)); // Store clothIDs that the user owns
      }
    };

    fetchUserClothes();
  }, [userID]);

  useEffect(() => {
    const fetchClothes = async () => {
      const allClothes = [];
      let clothID = 1; // Start from clothID 1
      let moreClothes = true; // Flag to check if more clothes exist

      while (moreClothes) {
        const response = await API_GET(`cloth/${clothID}`);

        if (response.result && response.data.length > 0) {
          allClothes.push(...response.data); // Add retrieved clothes to the array
          clothID++; // Increment clothID to fetch the next one
        } else {
          moreClothes = false; // No more clothes to fetch
        }
      }

      setClothes(allClothes); // Update state with all retrieved clothes
      setLoading(false); // Set loading to false
    };

    fetchClothes();
  }, []);

  const handleBuyClick = (cloth) => {
    setSelectedCloth(cloth);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const handleConfirmPurchase = async () => {
    if (!selectedCloth) return;

    // Check if the user's coins are sufficient
    if (userCoins < selectedCloth.clothCoin) {
      setShowCoinsModal(true); // Show modal when coins are insufficient
      setShowModal(false);
      return;
    }

    // Step 1: Update User Coins
    const updateCoinsResponse = await API_POST("updateCoinsCloth", {
      userID,
      clothID: selectedCloth.clothID, // Use selectedCloth.clothID to deduct coins
    });

    // Step 2: Insert Cloth into User_Cloth
    if (updateCoinsResponse.success) {
      const addUserClothResponse = await API_POST("addUserCloth", {
        userID,
        clothID: selectedCloth.clothID,
      });

      if (addUserClothResponse.result) {
        alert("ซื้อสำเร็จ!"); // Show success message

        // Update coins in localStorage and user's coin state
        const newCoinBalance = parseInt(userCoins) - selectedCloth.clothCoin;
        localStorage.setItem("coin", newCoinBalance); // Update localStorage
        setUserCoins(newCoinBalance); // Update state

        // Update userClothes state immediately
        setUserClothes((prevClothes) => [...prevClothes, selectedCloth.clothID]); // Add purchased clothID to userClothes
      } else {
        alert("การซื้อไม่สำเร็จ: " + addUserClothResponse.message);
      }
    } else {
      alert("การอัพเดตเหรียญไม่สำเร็จ: " + updateCoinsResponse.message);
    }

    setShowModal(false); // Close modal after processing
  };

  const handleCloseCoinsModal = () => setShowCoinsModal(false);

  const handleGoToShop = () => {
    setShowCoinsModal(false); // Close modal first
  };

  const handleGoToAddCoin = () => {
    setShowCoinsModal(false); // Close modal first
    navigate("/addcoin"); // Navigate to /addcoin page
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading indicator while fetching
  }

  return (
    <div>
      <div className="container absolute inset-x-0 top-0">
        <NavbarUser coins={userCoins} />
        {/* Row 1: Avatar and Shop Name */}
        <h className="row mb-4">
          <div className="col text-center">
            <img
              src={bgShop}
              alt="Shop Background"
              className="img-fluid w-100 px-48"
            />
          </div>
        </h>
        
        {/* Row 2: Category Buttons */}
        <div className="row mb-4 px-36">
          <div className="col ">
            <button className="btn btn-primary mx-2 w-32" onClick={() => navigate("/shophat")}>
              หมวก
            </button>
            <button className="btn btn-primary mx-2 w-32" disabled>เสื้อผ้า</button>
          </div>
        </div>

        {/* Row 3: List of Clothes */}
        <div className="card p-4 mx-32 mb-4">
          <div className="row ">
            {clothes.map((cloth) => (
              <div key={cloth.clothID} className="col-md-4">
                <div className="card m-2">
                  <h2 className="card-coin m-0">
                    <div className="d-flex align-items-center m-2 w-10">
                      <img src={coinicon} alt="Coin" className="mr-2" />
                      <span>{cloth.clothCoin}</span>
                    </div>
                  </h2>

                  <div className="avatar-container">
                    {/* Model Avatar */}
                    <img
                      src={modelAvatar}
                      alt="Model Avatar"
                      className="avatar-image"
                    />
                    {/* Cloth Item */}
                    <img
                      src={`http://localhost:3001/img/clothes/${cloth.clothImg}`}
                      alt="Cloth"
                      className="cloth-image"
                    />
                  </div>

                  <button
                    className="btn card-body text-center border-top fs-4 pt-3 pb-0"
                    onClick={() => handleBuyClick(cloth)}
                    disabled={userClothes.includes(cloth.clothID)} // Disable button if user already owns this cloth
                  >
                    {userClothes.includes(cloth.clothID) ? "ซื้อแล้ว" : "ซื้อ"}
                    {/* Show button label */}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal for purchasing a cloth */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>ยืนยันการซื้อ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCloth && (
            <div>
              <h5>คุณต้องการซื้อ {selectedCloth.clothName} หรือไม่?</h5>
              <p>ราคา: {selectedCloth.clothCoin} Coins</p>

              <div className="avatar-container">
                {/* Model Avatar */}
                <img
                  src={modelAvatar}
                  alt="Model Avatar"
                  className="avatar-image"
                />
                {/* Cloth Item */}
                <img
                  src={`http://localhost:3001/img/clothes/${selectedCloth.clothImg}`}
                  alt={selectedCloth.clothName}
                  className="cloth-image"
                />
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            ยกเลิก
          </Button>
          <Button variant="primary" onClick={handleConfirmPurchase}>
            ยืนยันการซื้อ
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for coins */}
      <Modal show={showCoinsModal} onHide={handleCloseCoinsModal}>
        <Modal.Header closeButton>
          <Modal.Title>เหรียญไม่เพียงพอ !!!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>จำนวน Coin หรือเหรียญสะสมของคุณ ไม่เพียงพอสำหรับสินค้านี้ !!</p>
          <h5>คุณต้องการเติมเงินเพื่อเพิ่ม Coin หรือไม่ ? </h5>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleGoToShop}>
            กลับ
          </Button>
          <Button variant="primary" onClick={handleGoToAddCoin}>
            ต้องการเติมเงิน
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ShopCloth;
