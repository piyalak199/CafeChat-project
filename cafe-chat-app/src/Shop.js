import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import NavbarUser from "./NavbarUser";
import { API_GET } from "./api"; // Import API_GET
import bgShop from "./img/Shop/bgShop.png";
import bow from "./img/Shop/bow.png";

function Shop() {
  const [hats, setHats] = useState([]); // State to store hats
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [showModal, setShowModal] = useState(false);
  const [selectedHat, setSelectedHat] = useState(null);

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
    setSelectedHat(hat); // Set the selected hat
    setShowModal(true); // Show the modal
  };

  const handleClose = () => setShowModal(false); // Close modal

  if (loading) {
    return <div>Loading...</div>; // Show loading indicator while fetching
  }

  return (
    <div>
      <div className="container absolute inset-x-0 top-0">
        <NavbarUser />

        {/* Row 1: Avatar and Shop Name */}
        <h className="row mb-4">
          <div className="col text-center">
            <img src={bgShop} alt="Avatar" className="img-fluid w-100 px-48" />
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
          <Button variant="primary" onClick={handleClose}>
            ยืนยันการซื้อ
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Shop;
