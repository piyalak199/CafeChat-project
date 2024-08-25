import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { Link } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import "./PetSelect.css";

export default function PetSelect() {

  return (
    <>
      <div className="container absolute inset-x-0 top-0">
        <header className="bg-black p-4"></header>
        <div className="grid grid-cols-10 gap-4 self-center h-10">
          <div className="col-start-1 self-center">
            <Link to="/home">
              <img src={"./img/homeicon.png"} className="m-0 min-w-full" alt="Homeicon" />
            </Link>
          </div>
          <div className="col-start-8 self-center">
            <Link to="/home">
              <CgProfile className="min-w-full min-h-14 text-black" />
            </Link>
          </div>
        </div>
        <div className="pet-section">
        <img src={"./img/word1.PNG"} className="wordone" alt="Word1" />
        <img src={"./img/petwall.PNG"} className="wallpaper" alt="Pets" />
          <div className="pet-buttons">
            <button className="button-dog">Dog</button>
            <button className="button-cat">Cat</button>
            <button className="button-rabbit">Rabbit</button>
            <button className="button-fish">Fish</button>
          </div>
          <img src={"./img/word2.PNG"} className="wordtwo" alt="Word2" />
        </div>
      </div>
    </>
  );
}
