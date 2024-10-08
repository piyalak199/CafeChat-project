import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { AiFillEdit } from "react-icons/ai";
import { FaCirclePlay } from "react-icons/fa6";

import bgHome from "./img/Home/bgHome.png";

import "./Home.css";
import NavbarUser from "./NavbarUser.js";

function Home() {
  const displayName = localStorage.getItem("displayName");

  return (
    <div>
      <div className="container absolute inset-x-0 top-0">
        <NavbarUser />
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
export default Home;
