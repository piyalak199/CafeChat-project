import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";

import { CgProfile } from "react-icons/cg";
import { IoIosNotifications } from "react-icons/io";
import { AiFillEdit } from "react-icons/ai";
import { FaCirclePlay } from "react-icons/fa6";

import "./Home.css";

export default function Home() {
  const username = "piyalak";
  const coin = 0;
  const displayName = "bua";

  // if (accessToken) 
  {
    // console.log("homepage", accessToken);

    return (
      <>
        <div class="container absolute inset-x-0 top-0">
          <header class="bg-black p-4"></header>
          <div class="grid grid-cols-10 gap-4 self-center h-10 ">
            <div class="col-start-0 self-center">
              <Link to={"/home"}>
                <img src={"img/homeicon.png"} class="m-0 min-w-full" alt="Homeicon" />
              </Link>
            </div>
            <div class="col-start-0 self-center">
              {username}
              </div>
            <div class="col-start-0 col-end-9 col-span-2 self-center">
              <Link to={"/home"}>
                <div className="image-container">
                  <div class="mt-4 translate-middle">
                    <button className="plus-button ">+</button>
                  </div>
                  <div className="number">{coin}</div>
                  <img src={"img/coin.png"} className=" coin" alt="Coin" />
                </div>
              </Link>
            </div>
            <div class="col-start-0 col-end-10 self-center ">
              <Link to={"/home"}>
                <IoIosNotifications class="min-w-full min-h-14 text-black" />
              </Link>
            </div>
            <div class="col-start-0 col-end-11 self-center ">
              <Link to={"/home"}>
                <CgProfile class="min-w-full min-h-14 text-black" />
              </Link>
            </div>
          </div>
          <div>
            <div>
              <Link to="/dressup">
                <button class="button-cloth">แต่งตัว</button>
              </Link>
            </div>

            <button class="button-shop">ร้านค้า</button>

            <Link to="/petselect">
              <button class="button-pet">สัตว์เลี้ยง</button>
            </Link>

            <button>
              {/* <AiFillEdit className="edit-displayName" /> */}
            </button>
            <div className="displayName">{displayName}</div>

            <button>
              <Link to={"/roompage"}>
                <FaCirclePlay class="button-play" />
              </Link>
            </button>
            <img src={"img/bgHome.png"} class="mt-2 w-full" alt="bgHome" />
          </div>
        </div>
      </>
    );
  }
  return <Navigate to="/" replace />;
}
