import React, { useState, useEffect } from "react";
import NavbarUser from "./NavbarUser";
import framecoin from "./img/Coin/framecoin.png";
import "./AddCoin.css";
import "bootstrap/dist/css/bootstrap.min.css";
import QRCodeImage from "./img/Coin/qrcode.png";
import coinicon from "./img/Coin/coin.png";
import { API_POST, API_GET } from "./api";

function AddCoin() {
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    const fetchCoins = async () => {
      const response = await API_GET("typecoin/0"); // Fetch all coins
      if (response.result) {
        setCoins(response.data);
      } else {
        console.error(response.message);
      }
    };

    fetchCoins();
  }, []);

  const handleBoxClick = (coin) => {
    console.log("Coin selected:", coin.coin, "Price:", coin.price);
    setSelectedCoin(coin); // Set the selected coin properly
    setShowModal(true); // Open modal
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedCoin(null);
  };

  return (
    <div>
      <div className="container absolute inset-x-0 top-0">
        <NavbarUser />
        <div className=" relative">
          <img src={framecoin} alt="Coin Frame" className="img-bgCoin" />

          <h1 className="title">เติมเหรียญ</h1>
          <div className="absolute items-center grid grid-cols-3 gap-4">
            {coins.map((coin) => (
              <div
                key={coin.coinID}
                className="box"
                onClick={() =>
                  handleBoxClick(coin) // Pass full coin object
                }
              >
                <h2 className="cointext">{coin.coin}</h2>
                <img src={coinicon} className="coinicon" alt="Coin Icon" />
                <p className="price">{coin.price} บาท</p>
              </div>
            ))}
          </div>
        </div>

        {/* Modal */}
        {showModal && selectedCoin && (
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">ยืนยันการเติมเหรียญ</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleClose}
                  ></button>
                </div>
                <div className="modal-body text-center">
                  <img
                    src={QRCodeImage}
                    alt="QR Code"
                    className="img-fluid mb-3"
                  />
                  <p>{selectedCoin.coin} coin</p> {/* Show selected coin */}
                  <p>{selectedCoin.price} บาท</p> {/* Show selected coin price */}
                  <div className="mb-3">
                    <label htmlFor="uploadSlip" className="form-label">
                      อัปโหลดสลิปโอนเงิน
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      id="uploadSlip"
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleClose}
                  >
                    ยกเลิก
                  </button>
                  <button type="button" className="btn btn-primary">
                    ยืนยัน
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddCoin;
