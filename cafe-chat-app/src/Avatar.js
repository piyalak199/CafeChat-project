import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import modelAvatar from "./img/Shop/model.png";

export default function Avatar({
  className,
  activeHats,
  activeClothes,
  activePet,
}) {
  return (
    <div className={`container ${className}`}>
      <div className="row justify-content-md-center">
        <div className="col col-lg-2">
          <div className="avatar-container">
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
        </div>

        {/* แสดงสัตว์เลี้ยงที่ active */}
        <div className="col content-end">
          {activePet && (
            <div
              className={`w-16 position-absolute start-48 ${
                className === "custom-home-avatar-class"
                  ? "custom-pet-position"
                  : ""
              }`} // ใช้ className เฉพาะในหน้า Home
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


// import "bootstrap/dist/css/bootstrap.min.css";
// import React from "react";
// import modelAvatar from "./img/Shop/model.png";

// export default function Avatar({
//   className,
//   activeHats  ,
//   activeClothes ,
//   activePet,
// }) {
//   return (
//     <div className={`container ${className}`}>
//       <div className="row justify-content-md-center">
//         <div className="col col-lg-2">
//           <div className="avatar-container position-relative">
//             {/* Main Avatar Image */}
//             <img
//               src={modelAvatar}
//               alt="Model Avatar"
//               className="avatar-image"
//             />

//             {/* Display active hats */}
//             {activeHats.length > 0 &&
//               activeHats.map((hat) => (
//                 <div key={hat.hatID} className="position-absolute" style={{ top: '10%', left: '25%' }}>
//                   <img
//                     src={`http://localhost:3001/img/Hat/${hat[0].hatImg}`}
//                     alt="Active Hat"
//                     className="hat-image"
//                   />
//                 </div>
//               ))}

//             {/* Display active clothes */}
//             {activeClothes.length > 0 &&
//               activeClothes.map((cloth) => (
//                 <div key={cloth.clothID} className="position-absolute" style={{ top: '60%', left: '15%' }}>
//                   <img
//                     src={`http://localhost:3001/img/Clothes/${cloth[0].clothImg}`}
//                     alt="Active Clothes"
//                     className="cloth-image"
//                   />
//                 </div>
//               ))}
//           </div>
//         </div>

//         {/* Display active pet */}
//         {activePet && (
//           <div className="col">
//             <div
//               className={`position-absolute start-48 ${className === "custom-home-avatar-class" ? "custom-pet-position" : ""}`}
//               style={{ transform: "translate(0%, -80%)" }}
//             >
//               <img
//                 src={`http://localhost:3001/img/Pets/${activePet.petImg}`}
//                 alt="Active Pet"
//                 className="pet-image"
//               />
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
