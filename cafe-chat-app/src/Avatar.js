// import "bootstrap/dist/css/bootstrap.min.css";
// import React from "react";
// import modelAvatar from "./img/Shop/model.png";

// export default function Avatar({ activeHats, activeClothes }) {
//   return (
//     <div className="avatar-container">
//       <img src={modelAvatar} alt="Model Avatar" className="avatar-image" />
//       {activeHats && activeHats.map(hat => (
//         <div key={hat.hatID}>
//           <img src={`http://localhost:3001/img/Hat/${hat.hatImg}`} alt="Active Hats" className="hat-image" />
//         </div>
//       ))}
//       {activeClothes && activeClothes.map(cloth => (
//         <div key={cloth.clothID}>
//           <img src={`http://localhost:3001/img/Clothes/${cloth.clothImg}`} alt="Active Clothes" className="cloth-image" />
//         </div>
//       ))}
//     </div>
//   );
// }


import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import modelAvatar from "./img/Shop/model.png";

export default function Avatar({ activeHats, activeClothes }) {
  return (
    <div className="avatar-container">
      <img src={modelAvatar} alt="Model Avatar" className="avatar-image" />

      {/* แสดงหมวกที่ active */}
      {activeHats && activeHats.map(hat => (
        <div key={hat.hatID}>
          <img src={`http://localhost:3001/img/Hat/${hat.hatImg}`} alt="Active Hats" className="hat-image" />
        </div>
      ))}

      {/* แสดงเสื้อผ้าที่ active */}
      {activeClothes && activeClothes.map(cloth => (
        <div key={cloth.clothID}>
          <img src={`http://localhost:3001/img/Clothes/${cloth.clothImg}`} alt="Active Clothes" className="cloth-image" />
        </div>
      ))}
    </div>
  );
}
