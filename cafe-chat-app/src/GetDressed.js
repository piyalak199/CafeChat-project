
// import "bootstrap/dist/css/bootstrap.min.css";
// import React, { useEffect, useState } from "react";
// import { API_GET } from "./api"; // Make sure to import your API functions
// import NavbarUser from "./NavbarUser.js";
// import bgShop from "./img/Shop/bgShop.png";
// import modelAvatar from "./img/Shop/model.png";
// import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

// export default function GetDressed() {
//   const userID = localStorage.getItem("userID"); // Get userID from localStorage
//   const [userHats, setUserHats] = useState([]); // State to store purchased hats
//   const [loading, setLoading] = useState(true); // Loading state
//   const navigate = useNavigate(); // Hook for navigation

//   useEffect(() => {
//     const fetchUserHats = async () => {
//       try {
//         const response = await API_GET(`userHats/${userID}`);
//         console.log("API Response:", response); // Log the response

//         if (response.result) {
//           setUserHats(response.data); // Assuming response.data contains the hat objects
//         } else {
//           console.error("Failed to fetch user hats.");
//         }
//       } catch (error) {
//         console.error("Error fetching user hats:", error); // Log any errors
//       } finally {
//         setLoading(false); // Set loading to false after fetching
//       }
//     };

//     fetchUserHats();
//   }, [userID]);

//   if (loading) {
//     return <div>Loading...</div>; // Show loading indicator
//   }

//   return (
//     <div className="container absolute inset-x-0 top-0">
//       <NavbarUser />

//         {/* Row 1: Avatar and Shop Name */}
//         <h className="row mb-4">
//           <div className="col text-center">
//             <img
//               src={bgShop}
//               alt="Shop Background"
//               className="img-fluid w-100 px-48"
//             />
//           </div>
//         </h>
//         {/* Row 2: Category Buttons */}
//         <div className="row mb-4 px-36">
//           <div className="col ">
//             <button className="btn btn-primary mx-2 w-32" disabled>
//               หมวก
//             </button>
//             <button
//               className="btn btn-primary mx-2 w-32"
//               onClick={() => navigate("/shopcloth")}
//             >
//               เสื้อผ้า
//             </button>
//           </div>
//         </div>
//         {/* Row 3: List of Hats */}
//         <div className="card p-4 mx-32 mb-4">
//           <div className="row ">
//             {userHats.length > 0 ? (
//               <div>
//                 {userHats.map((hat) => {
//                   console.log("Current Hat Object:", hat); // Log the current hat object
//                   return (
//                     <div key={hat.hatID}>
//                       <div>Hat ID: {hat.hatID} </div>
//                       <div>Hat Active: {hat.hat_active}</div>
//                       <div className="avatar-container">
//                         {/* Model Avatar */}
//                         <img
//                           src={modelAvatar}
//                           alt="Model Avatar"
//                           className="avatar-image"
//                         />
//                         {/* Hat Item */}
//                         <img
//                           src={`http://localhost:3001/img/hat/${hat.hatImg}`}
//                           alt="Hat"
//                           className="hat-image"
//                         />
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             ) : (
//               <p>คุณยังไม่ได้ซื้อหมวกใด ๆ</p> // Message if no hats are purchased
//             )}
//           </div>
//         </div>
//       </div>
//   );
// }



import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { API_GET } from "./api"; // Make sure to import your API functions
import NavbarUser from "./NavbarUser.js";
import bgShop from "./img/Shop/bgShop.png";
import modelAvatar from "./img/Shop/model.png";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

export default function GetDressed() {
  const userID = localStorage.getItem("userID"); // Get userID from localStorage
  const [userHats, setUserHats] = useState([]); // State to store purchased hats
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const fetchUserHats = async () => {
      try {
        const response = await API_GET(`hatdetailuser/${userID}`); // Call the correct API endpoint
        console.log("API Response:", response); // Log the response

        if (response.result) {
          setUserHats(response.data); // Assuming response.data contains the hat objects
        } else {
          console.error("Failed to fetch user hats.");
        }
      } catch (error) {
        console.error("Error fetching user hats:", error); // Log any errors
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchUserHats();
  }, [userID]);

  if (loading) {
    return <div>Loading...</div>; // Show loading indicator
  }

  return (
    <div className="container absolute inset-x-0 top-0">
      <NavbarUser />

      {/* Row 1: Avatar and Shop Name */}
      <h className="row mb-4">
        <div className="col text-center">
          <img
            src={bgShop}
            alt="Shop Background"
            className="img-fluid w-100 px-48"
          />
        </div>
      </h>
      {/* Row 2: Category Buttons */}
      <div className="row mb-4 px-36">
        <div className="col ">
          <button className="btn btn-primary mx-2 w-32" disabled>
            หมวก
          </button>
          <button
            className="btn btn-primary mx-2 w-32"
            onClick={() => navigate("/shopcloth")}
          >
            เสื้อผ้า
          </button>
        </div>
      </div>
      {/* Row 3: List of Hats */}
      <div className="card p-4 mx-32 mb-4">
        <div className="row ">
          {userHats.length > 0 ? (
            <div>
              {userHats.map((hat) => {
                console.log("Current Hat Object:", hat); // Log the current hat object
                return (
                  <div key={hat.hatID}>
                    <div>Hat ID: {hat.hatID}</div>
                    <div>Hat Name: {hat.hatName}</div>
                    <div className="avatar-container">
                      {/* Model Avatar */}
                      <img
                        src={modelAvatar}
                        alt="Model Avatar"
                        className="avatar-image"
                      />
                      {/* Hat Item */}
                      <img
                        src={`http://localhost:3001/img/hat/${hat.hatImg}`}
                        alt="Hat"
                        className="hat-image"
                      />
                    </div>
                    <div>Hat active: {hat.hat_active}</div>
                    <div>----------------------------------------</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p>คุณยังไม่ได้ซื้อหมวกใด ๆ</p> // Message if no hats are purchased
          )}
        </div>
      </div>
    </div>
  );
}
