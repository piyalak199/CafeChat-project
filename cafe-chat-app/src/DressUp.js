import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { Link } from "react-router-dom";

import "./DressUp.css";
import getdress from "./img/Clothes/getdress.png";
import seller from "./img/Shop/seller.png";
import framedress from "./img/Clothes/framedress.png";
import navysuit from "./img/Clothes/navysuit.png";
import bowsuit from "./img/Clothes/bowsuit.png";
import homeicon from "./img/Home/homeicon.png";
import coin from "./img/Login/coin.png";
import NavbarUser from "./NavbarUser.js";


export default function DressUp() {

  return (
      <div className="container absolute inset-x-0 top-0">
        
        <NavbarUser/>

        <div className="pet-section ">
          {/* <img src={getdress} className="getdress" alt="Word1" />
          <img src={seller} className="seller" alt="Pets" />
          <img src={framedress} className="framedress" alt="Word2" />
          <img src={framedress} className="framedress2" alt="Word2" />
          <img src={navysuit} className="navysuit" alt="Word3" />
          <img src={bowsuit} className="bowsuit" alt="Word4" /> */}
        </div>
      </div>
  );
}
