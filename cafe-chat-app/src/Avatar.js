import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import modelAvatar from "./img/Shop/model.png";

export default function Avatar({ className, activeHats, activeClothes, activePet }) {
  return (
    <div className={`container ${className}`}>
      <div class="row justify-content-md-center">
        <div className="col col-lg-2">
          <div className="avatar-container ">
            <div>
              <img
                src={modelAvatar}
                alt="Model Avatar"
                className="avatar-image"
              />

              {/* แสดงหมวกที่ active */}
              {activeHats &&
                activeHats.map((hat) => (
                  <div key={hat.hatID}>
                    <img
                      src={`http://localhost:3001/img/Hat/${hat.hatImg}`}
                      alt="Active Hats"
                      className="hat-image"
                    />
                  </div>
                ))}

              {/* แสดงเสื้อผ้าที่ active */}
              {activeClothes &&
                activeClothes.map((cloth) => (
                  <div key={cloth.clothID}>
                    <img
                      src={`http://localhost:3001/img/Clothes/${cloth.clothImg}`}
                      alt="Active Clothes"
                      className="cloth-image "
                    />
                  </div>
                ))}
            </div>
          </div>
          {/* แสดงสัตว์เลี้ยงที่ active */}
        </div>
        <div className="col content-end">
          {activePet && (
            <div
              className="w-16 position-absolute start-48 "
              style={{ transform: "translate( 0%, -80%)" }}
            >
              <img
                src={`http://localhost:3001/img/Pets/${activePet.petImg}`}
                alt="Active Pet"
                className="pet-image "
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
