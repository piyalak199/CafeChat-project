import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";

import { CgProfile } from "react-icons/cg";
import { IoIosNotifications } from "react-icons/io";
import { AiFillEdit } from "react-icons/ai";
import { FaCirclePlay } from "react-icons/fa6";

import homeicon from "./img/Home/homeicon.png";
import coinpng from "./img/Login/coin.png";
import bgHome from "./img/Home/bgHome.png";

import "./Home.css";

export default function Home() {
  // ดึงข้อมูลจาก localStorage
  const username = localStorage.getItem("username");
  const displayName = localStorage.getItem("display_name");
  const coin = localStorage.getItem("coin");

  // ตรวจสอบว่าผู้ใช้มีการเข้าสู่ระบบหรือไม่
  if (!username) {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      <div className="container absolute inset-x-0 top-0">
        <header className="bg-black p-4"></header>
        <div className="grid grid-cols-10 gap-4 self-center h-10 ">
          <div className="col-start-0 self-center">
            <Link to={"/home"}>
              <img src={homeicon} className="m-0 min-w-full" alt="Homeicon" />
            </Link>
          </div>
          <div className="col-start-0 self-center">{username}</div>
          <div className="col-start-0 col-end-9 col-span-2 self-center">
            <Link to={"/home"}>
              <div className="image-container">
                <div className="mt-4 translate-middle">
                  <button className="plus-button">+</button>
                </div>
                <div className="number">{coin}</div>
                <img src={coinpng} className="coin" alt="Coin" />
              </div>
            </Link>
          </div>
          <div className="col-start-0 col-end-10 self-center ">
            <Link to={"/home"}>
              <IoIosNotifications className="min-w-full min-h-14 text-black" />
            </Link>
          </div>
          <div className="col-start-0 col-end-11 self-center ">
            <Link to={"/home"}>
              <CgProfile className="min-w-full min-h-14 text-black" />
            </Link>
          </div>
        </div>

        <div>
          <Link className="button-cloth" to="/dressup">
            แต่งตัว
          </Link>
        </div>

        <Link className="button-shop" to="/dressup">
          ร้านค้า
        </Link>

        <Link className="button-pet" to="/petselect">
          สัตว์เลี้ยง
        </Link>

        <div>
          <AiFillEdit className="edit-displayName" />
          <div className="displayName">{displayName}</div>
        </div>

        <div>
          <Link to={"/chatroom"}>
            <FaCirclePlay className="button-play" />
          </Link>
        </div>

        <img src={bgHome} className="mt-2 w-full" alt="bgHome" />

      </div>

    </div>
  );
}
