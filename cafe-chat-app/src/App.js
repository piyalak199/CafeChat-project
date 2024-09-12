import "bootstrap/dist/css/bootstrap.min.css";
// import { useState } from "react";
// import { Form, Row, Col, Button } from "react-bootstrap";
import { Link, Route, Router, Routes } from "react-router-dom";

import "./App.css";
import { MdAccountCircle } from "react-icons/md";

import bgApp from "./img/Login/bgLogin.png";

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
            <img src={bgApp} class=" size-fit m-0" alt="bgApp" />
          </div>
          <div class="flex justify-center ">
            <Link to={"/login"}>
              <button class="log-in-button">ลงชื่อเข้าใช้</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
