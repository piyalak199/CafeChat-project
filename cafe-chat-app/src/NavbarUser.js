import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState} from "react";
// import {  } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { IoIosNotifications } from "react-icons/io";
import { BsPersonFill } from "react-icons/bs";
import homeicon from "./img/Home/homeicon.png";
import coinpng from "./img/Login/coin.png";
import "./NavbarUser.css";

const NavbarUser = () => {
  let navigate = useNavigate();

  // ดึงข้อมูลผู้ใช้จาก localStorage
  const coin = localStorage.getItem("coin");

  const handleLogout = () => {
    // ลบข้อมูลการเข้าสู่ระบบจาก localStorage
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("username");
    localStorage.removeItem("display_name");
    localStorage.removeItem("coin");
    localStorage.removeItem("pettypeID");
    localStorage.removeItem("petName");
    localStorage.removeItem("petImg");
    localStorage.removeItem("roleID");
    localStorage.removeItem("roleName");

    // นำผู้ใช้ไปยังหน้า login
    navigate("/login", { replace: true });
  };

  const [showLogout, setShowLogout] = useState(false);

  const handleIconClick = () => {
    setShowLogout(!showLogout); // สลับการแสดงปุ่มออกจากระบบ
  };
  

  return (
    <div>
      <header className="bg-black"></header>
      <nav className="navbar">
        <div className="container-fluid">
          <div className="row w-100 h-16 align-items-center justify-content-between">
            {/* Home Icon */}
            <Link className="col-auto">
              <img
                src={homeicon}
                className="home-icon"
                alt="Home icon"
                onClick={() => navigate("/home")}
              />
            </Link>

            <div className="col-auto d-flex align-items-center right-section">
              {/* Coin Section */}
              <div className="d-flex align-items-center coin-section me-3">
                <button className="btn btn-sm plus-button me-2">+</button>
                <span className="coin-text me-2">{coin}</span>
                <img src={coinpng} className="coin-icon" alt="Coin" />
              </div>

              {/* Notifications */}
              <div className="me-3">
                <Link to="/notifications">
                  <IoIosNotifications className="notifications-icon " />
                </Link>
              </div>

              {/* Profile Icon */}
              <div>
                <BsPersonFill
                  className="profile-icon"
                  onClick={handleIconClick}
                />
                {showLogout && (
                  <button onClick={handleLogout} className="btn logout-button">
                    ออกจากระบบ
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavbarUser;
