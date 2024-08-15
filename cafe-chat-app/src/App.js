import "bootstrap/dist/css/bootstrap.min.css";
// import { useState } from "react";
// import { Form, Row, Col, Button } from "react-bootstrap";
import { Link, Route, Router, Routes } from "react-router-dom";

import "./App.css";
import bgLogin from "./img/bgLogin.png";
import { MdAccountCircle } from "react-icons/md";
import Header from "./components/Header";
import PetSelect from "./PetSelect";
import Home from "./Home";

export default function App() {
  return (
    <div className="App">
      <div class="container absolute inset-x-0 top-0">
      <header class="bg-black p-4"></header>
        <div class="grid grid-flow-row auto-rows-max">
          <div class="flex justify-end mt-3">
            <Link to={"/signup"} class="text-decoration-none">
              <button class="sign-up-button m-0 " type="button">
                <MdAccountCircle size={50} />
                ลงทะเบียน
              </button>
            </Link>
          </div>
          <div class="flex justify-center">
            <img src={bgLogin} class=" size-fit m-10" alt="bgLogin" />
          </div>
          <div class="flex justify-center ">
            <Link to={"/login"}>
              <button class="log-in-button">ลงชื่อเข้าใช้</button>
            </Link>
          </div>
          {/* <div className="flex justify-end mt-3">
              <Link to="/homepage" className="text-decoration-none">
                <button className="sign-up-button m-0" type="button">
                  <MdAccountCircle size={50} />
                  Homepage
                </button>
              </Link>
            </div> */}

         <Routes>
          <Route path="/petselect" element={<PetSelect />} />
          <Route path="/home" element={<Home />} />
          {/* เพิ่ม Route อื่นๆ ที่คุณต้องการที่นี่ */}
        </Routes>
        </div>
      </div>
      </div>
  );
}
