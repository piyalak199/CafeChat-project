import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import "./PetSelect.css";
import NavbarUser from "./NavbarUser.js";

export default function PetSelect() {


  return (
    <div className="container absolute inset-x-0 top-0">
      <NavbarUser />
      <div className="pets-section">
        
      </div>
    </div>
  );
}
