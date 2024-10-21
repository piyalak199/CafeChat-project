"use client";
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
  const [slipokData, setSlipokData] = useState([]);
  const [files, setFiles] = useState("");
  const [userCoins, setUserCoins] = useState([]);
  const [isSlipSubmitted, setIsSlipSubmitted] = useState(false); // New state variable

  const handleFile = (e) => {
    setFiles(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("files", files);
    formData.append("log", "true");

    try {
      const res = await fetch("https://api.slipok.com/api/line/apikey/32065/", {
        method: "POST",
        headers: {
          "x-authorization": "SLIPOKEIYQA0V",
        },
        body: formData,
      });

      const data = await res.json();
      console.log("SlipOk data: ", data);

      if (res.ok) {
        console.log("Request successfully");
        setSlipokData(data.data);

        setIsSlipSubmitted(true); // Mark that the slip has been submitted

        if (data.data.success) {
          // If slip is valid, check the amount
          if (data.data.amount === selectedCoin.price) {
            // Update user coins if the amount matches
            const userID = localStorage.getItem("userID");
            const response = await API_POST("updateAddCoin", {
              coinID: selectedCoin.coinID,
              userID,
            });

            if (response.success) {
              console.log("Coins updated successfully");
              const userCoins = localStorage.getItem("coin") || 0;
              const newCoinBalance =
                parseInt(userCoins) + parseInt(selectedCoin.coin);
              localStorage.setItem("coin", newCoinBalance);
              setUserCoins(newCoinBalance);
              setShowModal(false);
              alert("Coin update successful!");
            } else {
              alert("Failed to update coins!");
            }
          } else {
            alert("Slip amount does not match the coin price!");
          }
        } else {
          alert("Slip validation failed!");
        }
      } else {
        throw new Error(
          `Failed to send a request: ${data.message || res.statusText}`
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    const fetchCoins = async () => {
      const response = await API_GET("typecoin/0");
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
    setSelectedCoin(coin);
    setShowModal(true);
    setIsSlipSubmitted(false); // Reset slip submission status when selecting a new coin
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedCoin(null);
    setIsSlipSubmitted(false); // Reset slip submission status when selecting a new coin
  };

  return (
    <div>
      <div className="container absolute inset-x-0 top-0">
        <NavbarUser />
        <div className="relative">
          <img src={framecoin} alt="Coin Frame" className="img-bgCoin" />

          <h1 className="title">เติมเหรียญ</h1>
          <div className="absolute items-center .grid-coin grid grid-cols-3 gap-4">
            {coins.map((coin) => (
              <div
                key={coin.coinID}
                className="box"
                onClick={() => handleBoxClick(coin)}
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
                    style={{
                      position: "relative",
                      left: "60px", 
                    }}
                  />
                  <p>{selectedCoin.coin} coin</p>
                  <p>{selectedCoin.price} บาท</p>

                  <div className="mb-3">
                    <label htmlFor="uploadSlip" className="form-label">
                      อัปโหลดสลิปโอนเงิน
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      id="uploadSlip"
                      onChange={handleFile}
                    />

                    <img
                      src={files && URL.createObjectURL(files)}
                      alt="slip"
                      width={300}
                    />

                    {/* Show amount and validation message only after submission */}
                    {isSlipSubmitted && (
                      <div>
                        <p>จำนวนเงินที่คุณโอน: {slipokData?.amount}</p>
                        {slipokData?.success === true ? (
                          <p>สลิปถูกต้อง</p>
                        ) : (
                          <p>สลิปไม่ถูกต้อง !!</p>
                        )}
                      </div>
                    )}
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
                  <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={handleSubmit} // Call handleSubmit to check and send slip
                  >
                    ส่งสลิปโอนเงิน
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
