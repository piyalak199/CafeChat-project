import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import NavbarUser from "./NavbarUser";
import { API_GET, API_POST } from "./api"; // Import API_GET and API_POST
import bgShop from "./img/Shop/bgShop.png";
import { useNavigate } from "react-router-dom";

function Shop() {
  const navigate = useNavigate(); // ใช้ navigate เพื่อนำทางไปยังหน้าอื่น
  const [hats, setHats] = useState([]); // State to store hats
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [showModal, setShowModal] = useState(false);
  const [selectedHat, setSelectedHat] = useState(null);
  const userID = localStorage.getItem("userID"); // Get userID from localStorage
  const [userCoins, setUserCoins] = useState(localStorage.getItem("coin") || 0); // State for user coins
  const [showCoinsModal, setShowCoinsModal] = useState(false);

  useEffect(() => {
    const fetchHats = async () => {
      const allHats = [];
      let hatID = 1; // Start from hatID 1
      let moreHats = true; // Flag to check if more hats exist

      while (moreHats) {
        const response = await API_GET(`hats/${hatID}`);

        if (response.result && response.data.length > 0) {
          allHats.push(...response.data); // Add retrieved hats to the array
          hatID++; // Increment hatID to fetch the next one
        } else {
          moreHats = false; // No more hats to fetch
        }
      }

      setHats(allHats); // Update state with all retrieved hats
      setLoading(false); // Set loading to false
    };

    fetchHats();
  }, []); // Empty dependency array ensures this runs once on mount

  const handleBuyClick = (hat) => {
    setSelectedHat(hat);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const handleConfirmPurchase = async () => {
    if (!selectedHat) return;

    // ตรวจสอบว่าเหรียญของผู้ใช้พอซื้อหรือไม่
    if (userCoins < selectedHat.hatCoin) {
      setShowCoinsModal(true); // แสดง modal เมื่อเหรียญไม่พอ
      setShowModal(false);
      return;
    }

    // Step 1: Update User Coins
    const updateCoinsResponse = await API_POST("updateCoins", {
      userID,
      hatID: selectedHat.hatID, // ใช้ selectedHat.hatID เพื่อหักเหรียญ
    });

    // Step 2: Insert Hat into User_Hat
    if (updateCoinsResponse.success) {
      const addUserHatResponse = await API_POST("addUserHat", {
        userID,
        hatID: selectedHat.hatID,
      });

      if (addUserHatResponse.result) {
        alert("ซื้อสำเร็จ!"); // แสดงข้อความสำเร็จ

        // อัพเดตเหรียญใน localStorage และ state ของเหรียญผู้ใช้
        const newCoinBalance = parseInt(userCoins) - selectedHat.hatCoin;
        localStorage.setItem("coin", newCoinBalance); // อัพเดต localStorage
        setUserCoins(newCoinBalance); // อัพเดต state
      } else {
        alert("การซื้อไม่สำเร็จ: " + addUserHatResponse.message);
      }
    } else {
      alert("การอัพเดตเหรียญไม่สำเร็จ: " + updateCoinsResponse.message);
    }

    setShowModal(false); // ปิด modal หลังจากดำเนินการเสร็จสิ้น
  };

  const handleCloseCoinsModal = () => setShowCoinsModal(false);

  const handleGoToShop = () => {
    setShowCoinsModal(false); // ปิด Modal ก่อน
  };

  const handleGoToAddCoin = () => {
    setShowCoinsModal(false); // ปิด Modal ก่อน
    navigate("/addcoin"); // นำทางไปที่หน้า /addcoin
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
            <button className="btn btn-primary mx-2 w-32">หมวก</button>
            <button className="btn btn-primary mx-2 w-32">เสื้อผ้า</button>
          </div>
        </div>
        {/* Row 3: List of Hats */}
        <div className="card p-4 mx-32 mb-4">
          <div className="row ">
            {hats.map((hat) => (
              <div key={hat.hatID} className="col-md-4">
                <div className="card ">
                  <h2 className="card-text m-0">Coin: {hat.hatCoin}</h2>
                  <img
                    src={`http://localhost:3001/img/hat/${hat.hatImg}`}
                    alt={hat.hatName}
                    className="card-img-top px-5 py-0"
                  />
                  <button
                    className="btn card-body text-center border-top fs-4 pt-3 pb-0"
                    onClick={() => handleBuyClick(hat)}
                  >
                    ซื้อ
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal for purchasing a hat */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>ยืนยันการซื้อ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedHat && (
            <>
              <h5>คุณต้องการซื้อ {selectedHat.hatName} หรือไม่?</h5>
              <p>ราคา: {selectedHat.hatCoin} Coins</p>
              <img
                src={`http://localhost:3001/img/hat/${selectedHat.hatImg}`}
                alt={selectedHat.hatName}
                className="img-fluid"
              />
            </>
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

      {/* Modal for  coins */}
      <Modal show={showCoinsModal} onHide={handleCloseCoinsModal}>
        <Modal.Header closeButton>
          <Modal.Title>เหรียญไม่เพียงพอ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Coin หรือเหรียญสะสมของคุณไม่เพียงพอสำหรับสินค้านี้!!</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleGoToShop}>
            กลับไปหน้า Shop
          </Button>
          <Button variant="primary" onClick={handleGoToAddCoin}>
            ไปหน้าเติมเงิน
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Shop;
