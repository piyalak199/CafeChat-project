"use client";
import React, { useState, useEffect } from "react";
import NavbarUser from "./NavbarUser";
import framecoin from "./img/Coin/framecoin.png";
import "./AddCoin.css";
import "bootstrap/dist/css/bootstrap.min.css";
import QRCodeImage from "./img/Coin/qrcode.jpg";
import coinicon from "./img/Coin/coin.png";
import { API_POST, API_GET } from "./api";

function AddCoin() {
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [coins, setCoins] = useState([]);
  const [slipokData, setSlipokData] = useState([]);
  const [files, setFiles] = useState("");

  const [submitStatus, setSubmitStatus] = useState(false);
  const [userCoins, setUserCoins] = useState([]);

  const handleFile = (e) => {
    setFiles(e.target.files[0]);
  };

  console.log("Select files: ", files);


  //     // Check if the slip amount matches the selected coin price
  //     if (data.data.success && data.data.amount === selectedCoin.price) {
  //       setSubmitStatus("success");

  //       // Update User Coins in the database
  //       const userID = localStorage.getItem("userID");
  //       const response = await API_POST("updateAddCoin", {
  //         coinID: selectedCoin.coinID,
  //         userID,
  //       });

  //       if (response.success) {
  //         console.log("Coins updated successfully");

  //         // อัปเดตเหรียญใน localStorage และ state ของเหรียญผู้ใช้
  //         const userCoins = localStorage.getItem("coin") || 0; // ดึงเหรียญจาก localStorage
  //         const newCoinBalance =
  //           parseInt(userCoins) + parseInt(selectedCoin.coin); // เพิ่มเหรียญที่ได้รับ
  //         localStorage.setItem("coin", newCoinBalance); // อัปเดต localStorage
  //         setUserCoins(newCoinBalance); // อัปเดต state
  //         setShowModal(false);
  //       } else {
  //         console.log("Failed to update coins:", response.message);
  //       }


  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("files", files);     // เพิ่มไฟล์ที่เลือก
    formData.append("log", "true");      // เพิ่มค่า log เป็นสตริง "true"
    
    try {
      const res = await fetch("https://api.slipok.com/api/line/apikey/32065/", {
        method: "POST",
        headers: {
          "x-authorization": "SLIPOKEIYQA0V", // ตรวจสอบว่า API key ถูกต้อง
        },
        body: formData
      });
  
      // Parse the response JSON
      const data = await res.json();    // เรียก json ก่อนตรวจสอบ res.ok
      console.log("SlipOk data: ", data);
  
      if (res.ok) {
        console.log("Request successfully");
        setSlipokData(data.data);        // ตั้งค่า slipokData ถ้าสำเร็จ

      } else {
        throw new Error(`Failed to send a request: ${data.message || res.statusText}`);
      }
  
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSendSlip = async () => {
    if (!slipokData.success) {
      alert("Slip validation failed!");
      return;
    }
  
    // Update User Coins in the database
    const userID = localStorage.getItem("userID");
    const response = await API_POST("updateAddCoin", {
      coinID: selectedCoin.coinID,
      userID,
    });
  
    if (response.success) {
      console.log("Coins updated successfully");
      const userCoins = localStorage.getItem("coin") || 0;
      const newCoinBalance = parseInt(userCoins) + parseInt(selectedCoin.coin);
      localStorage.setItem("coin", newCoinBalance);
      setUserCoins(newCoinBalance);
      setShowModal(false);
      alert("Coin update successful!");
    } else {
      alert("Failed to update coins!");
    }
  };
  
  

  const handleCoinUpdate = (newCoin) => {
    setUserCoins((prevCoins) => {
      // ตรวจสอบว่า prevCoins เป็น array
      if (!Array.isArray(prevCoins)) {
        return [newCoin]; // ถ้าไม่ใช่ array ให้สร้าง array ใหม่
      }
      return [...prevCoins, newCoin]; // เพิ่ม newCoin ใน array
    });
  };

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
          <div className="absolute items-center .grid-coin grid grid-cols-3 gap-4">
            {coins.map((coin) => (
              <div
                key={coin.coinID}
                className="box"
                onClick={
                  () => handleBoxClick(coin) // Pass full coin object
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
                  <p>{selectedCoin.coin} coin</p>
                  <p>{selectedCoin.price} บาท</p>

                  <div className="mb-3" >
                    <label htmlFor="uploadSlip" className="form-label">
                      อัปโหลดสลิปโอนเงิน
                    </label>
                    <form onSubmit={handleSubmit}>
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

                      <button type="submit">
                        Check Slip
                      </button>

                      {slipokData?.success === true ? (
                        <p>สลิปถูกต้อง</p>
                      ) : (
                        <p>สลิปไม่ถูกต้อง !!</p>
                      )}
                      <p>จำนวนเงิน: {slipokData?.amount}</p>
                    </form>
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

                 <div>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      onClick={handleSendSlip}
                    >
                      ส่ง
                  </button>

                  </div>
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
