import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { Link } from "react-router-dom";
import Homeicon from "./img/homeicon.png";
import getdress from "./img/getdress.PNG";
import framedress from "./img/framedress.PNG";
import seller from "./img/seller.PNG";
import Coin from "./img/coin.png";
import { CgProfile } from "react-icons/cg";
import { IoIosNotifications } from "react-icons/io";
import navysuit from "./img/navysuit.PNG";
import bowsuit from "./img/bowsuit.PNG";

import "./DressUp.css";

export default function DressUp() {
  const coin = 100;

  return (
    <>
      <div className="container absolute inset-x-0 top-0">
        <header className="bg-black p-4"></header>
        <div class="grid grid-cols-10 gap-4 self-center h-10 ">
          <div class="col-start-0 self-center">
            <Link to={"/home"}>
              <img src={Homeicon} class="m-0 min-w-full" alt="Homeicon" />
            </Link>
          </div>
          <div class="col-start-0 col-end-9 col-span-2 self-center">
            <Link to={"/home"}>
              <div className="image-container">
                <div class="mt-4 translate-middle">
                  <button className="plus-button ">+</button>
                </div>
                <div className="number">{coin}</div>
                <img src={Coin} className=" coin" alt="Coin" />
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
        <div className="pet-section">
          <img src={getdress} className="wordone" alt="Word1" />
          <img src={seller} className="seller" alt="Pets" />
          <img src={framedress} className="framedress" alt="Word2" />
          <img src={navysuit} className="navysuit" alt="Word3" />
          <img src={bowsuit} className="bowsuit" alt="Word4" />
        </div>
      </div>
    </>
  );
}
