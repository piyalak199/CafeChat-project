// import React, { useEffect, useState } from "react";
// import NavbarUser from "./NavbarUser";
// import { API_GET } from "./api"; // Import API_GET

// function Shop() {
//   const [hats, setHats] = useState([]); // State to store hats
//   const [loading, setLoading] = useState(true); // State to manage loading status

//   useEffect(() => {
//     const fetchHats = async () => {
//       const allHats = [];
//       let hatID = 1; // Start from hatID 1
//       let moreHats = true; // Flag to check if more hats exist

//       while (moreHats) {
//         const response = await API_GET(`hats/${hatID}`);
        
//         if (response.result && response.data.length > 0) {
//           allHats.push(...response.data); // Add retrieved hats to the array
//           hatID++; // Increment hatID to fetch the next one
//         } else {
//           moreHats = false; // No more hats to fetch
//         }
//       }

//       setHats(allHats); // Update state with all retrieved hats
//       setLoading(false); // Set loading to false
//     };

//     fetchHats();
//   }, []); // Empty dependency array ensures this runs once on mount

//   if (loading) {
//     return <div>Loading...</div>; // Show loading indicator while fetching
//   }

//   return (
//     <div>
//       <div className="container absolute inset-x-0 top-0">
//         <NavbarUser />
//         <h1>Shop</h1>
//         <div className="hats-list">
//           {hats.map((hat) => (
//             <div key={hat.hatID} className="hat-item">
//               <h2>{hat.hatName}</h2> {/* Display hat name */}
//               <p>Price: {hat.hatCoin} Coins</p> {/* Display coin price */}
//               <img 
//                 src={`http://localhost:3001/img/hat/${hat.hatImg}`}
//                 alt={hat.hatID} 
//               />
//               {/* Display hat image */}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Shop;

import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import NavbarUser from "./NavbarUser";
import { API_GET } from "./api"; // Import API_GET

function Shop() {
  const [hats, setHats] = useState([]); // State to store hats
  const [loading, setLoading] = useState(true); // State to manage loading status

  useEffect(() => {
    const fetchHats = async () => {
      const allHats = [];
      let hatID = 1; // Start from hatID 1
      let moreHats = true; // Flag to check if more hats exist

      while (moreHats) {
        const response = await API_GET(`hats/${hatID}`);
        
        if (response.result && response.data.length > 0) {
          allHats.push(...response.data); // Add retrieved hats to the array
          hatID++; // Increment hatID to fetch the next one
        } else {
          moreHats = false; // No more hats to fetch
        }
      }

      setHats(allHats); // Update state with all retrieved hats
      setLoading(false); // Set loading to false
    };

    fetchHats();
  }, []); // Empty dependency array ensures this runs once on mount

  if (loading) {
    return <div>Loading...</div>; // Show loading indicator while fetching
  }

  return (
    <div>
      <div className="container absolute inset-x-0 top-0">
        <NavbarUser />
        <h1 className="text-center">ร้านค้า คาเฟ่แชท</h1>

        {/* Row 1: Avatar and Shop Name */}
        <div className="row mb-4">
          <div className="col text-center">
            <img 
              src="path_to_avatar_image" 
              alt="Avatar" 
              className="img-fluid rounded-circle" // Responsive and circular
              style={{ width: '100px', height: '100px' }} // Adjust size as needed
            />
          </div>
        </div>

        {/* Row 2: Category Buttons */}
        <div className="row mb-4">
          <div className="col text-center">
            <button className="btn btn-primary mx-2">หมวก</button>
            <button className="btn btn-primary mx-2">เสื้อผ้า</button>
          </div>
        </div>

        {/* Row 3: List of Hats */}
        <div className="row">
          {hats.map((hat) => (
            <div key={hat.hatID} className="col-md-4 mb-4"> {/* Responsive columns */}
              <div className="card">
                <img 
                  src={`http://localhost:3001/img/hat/${hat.hatImg}`} 
                  alt={hat.hatName} 
                  className="card-img-top" 
                />
                <div className="card-body text-center">
                  <h5 className="card-title">{hat.hatName}</h5>
                  <p className="card-text">Coin: {hat.hatCoin}</p>
                  {/* Replace 'path_to_model_avatar_image' with the actual model avatar image URL */}
                  <img 
                    src="path_to_model_avatar_image" 
                    alt="Model Avatar" 
                    className="img-fluid" // Responsive image
                    style={{ width: '50px', height: '50px' }} // Adjust size as needed
                  />
                  <button className="btn btn-success mt-2">ซื้อ</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Shop;
