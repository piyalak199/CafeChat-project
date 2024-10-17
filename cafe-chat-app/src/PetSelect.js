// import React, { useEffect, useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { API_GET, API_POST } from "./api";
// import NavbarUser from "./NavbarUser.js";
// import "./PetSelect.css";

// function PetSelect() {
//   const userID = localStorage.getItem("userID");
//   const [petTypes, setPetTypes] = useState([]);
//   const [currentPetTypeID, setCurrentPetTypeID] = useState(null); // เริ่มต้นเป็น null

//   // ดึงข้อมูล pet types และ petTypeID ของผู้ใช้
//   useEffect(() => {
//     const fetchPetTypes = async () => {
//       try {
//         // ดึงข้อมูล pet types
//         const petTypesResponse = await API_GET("pettype");
//         setPetTypes(petTypesResponse.data); // เก็บ pet types ที่ดึงมา

//         // ดึง petTypeID ของผู้ใช้
//         const userResponse = await API_GET(`user/${userID}`);
//         if (userResponse.data && userResponse.data.petTypeID) {
//           const userPetTypeID = userResponse.data.petTypeID;
//           setCurrentPetTypeID(userPetTypeID); // ตั้งค่า pet type ID ที่ถูกเลือก
//           localStorage.setItem("petTypeID", userPetTypeID); // อัปเดต local storage
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchPetTypes();
//   }, [userID]);

//   // ฟังก์ชันจัดการการเปลี่ยน pet type
//   const handlePetTypeChange = async (newPetTypeID) => {
//     if (currentPetTypeID === newPetTypeID) {
//       console.log("เลือก pet type นี้อยู่แล้ว");
//       return; // ถ้าเลือกแล้วไม่ต้องเปลี่ยน
//     }

//     try {
//       // อัปเดต pet type ในฐานข้อมูล
//       const response = await API_POST("updatePetType", {
//         userID: userID,
//         petTypeID: newPetTypeID,
//       });
//       console.log("อัปเดต pet type:", response.message);

//       // อัปเดต local storage และ state
//       localStorage.setItem("petTypeID", newPetTypeID);
//       setCurrentPetTypeID(newPetTypeID); // อัปเดต state
//     } catch (error) {
//       console.error("Error updating pet type:", error);
//     }
//   };

//   return (
//     <div className="container absolute inset-x-0 top-0">
//       <NavbarUser />
//       <div className="row flex justify-center">
//         {petTypes.map((pet) => (
//           <div className={`col-md-auto mx-20`} key={pet.petTypeID}>
//             <div className="text-center">
//               <img
//                 src={`http://localhost:3001/img/Pets/${pet.petImg}`}
//                 alt={pet.petName}
//                 className="img-fluid"
//               />
//               <button
//                 type="button"
//                 className="btn btn-selectpet m-2"
//                 onClick={() => handlePetTypeChange(pet.petTypeID)}
//                 disabled={currentPetTypeID === pet.petTypeID} // ปิดการใช้งานถ้าตรงกับ pet type ที่เลือก
//               >
//                 {currentPetTypeID === pet.petTypeID ? "เลือกอยู่" : pet.petName}
//               </button>
              
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default PetSelect;



import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { API_GET, API_POST } from "./api";
import NavbarUser from "./NavbarUser.js";
import "./PetSelect.css";

function PetSelect() {
  const userID = localStorage.getItem("userID");
  const [petTypes, setPetTypes] = useState([]);
  const [currentPetTypeID, setCurrentPetTypeID] = useState(localStorage.getItem("petTypeID")); // ดึงจาก localStorage เริ่มต้น
  const [currentPetName, setCurrentPetName] = useState("");

  // ดึงข้อมูล pet types และตรวจสอบ petTypeID ใน localStorage
  useEffect(() => {
    const fetchPetTypes = async () => {
      try {
        const petTypesResponse = await API_GET("pettype");
        setPetTypes(petTypesResponse.data);

        // ถ้า localStorage มี petTypeID ให้ตั้งค่า petName ที่ถูกเลือก
        const savedPetTypeID = localStorage.getItem("petTypeID");
        if (savedPetTypeID) {
          const selectedPet = petTypesResponse.data.find(
            (pet) => pet.petTypeID === parseInt(savedPetTypeID)
          );
          if (selectedPet) {
            setCurrentPetName(selectedPet.petName);
          }
        } else {
          // ถ้าไม่มี petTypeID ใน localStorage ให้ดึงจากฐานข้อมูล
          const userResponse = await API_GET(`user/${userID}`);
          if (userResponse.data && userResponse.data.petTypeID) {
            const userPetTypeID = userResponse.data.petTypeID;
            setCurrentPetTypeID(userPetTypeID);
            localStorage.setItem("petTypeID", userPetTypeID);

            // หา petName ของสัตว์เลี้ยงที่ถูกเลือก
            const selectedPet = petTypesResponse.data.find(
              (pet) => pet.petTypeID === userPetTypeID
            );
            if (selectedPet) {
              setCurrentPetName(selectedPet.petName);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchPetTypes();
  }, [userID]);

  // ฟังก์ชันจัดการการเปลี่ยน pet type
  const handlePetTypeChange = async (newPetTypeID) => {
    if (currentPetTypeID === newPetTypeID) {
      console.log("เลือก pet type นี้อยู่แล้ว");
      return;
    }

    try {
      const response = await API_POST("updatePetType", {
        userID: userID,
        petTypeID: newPetTypeID,
      });
      console.log("อัปเดต pet type:", response.message);

      // อัปเดต local storage และ state
      localStorage.setItem("petTypeID", newPetTypeID);
      setCurrentPetTypeID(newPetTypeID);

      // อัปเดตชื่อสัตว์เลี้ยงที่เลือก
      const selectedPet = petTypes.find((pet) => pet.petTypeID === newPetTypeID);
      if (selectedPet) {
        setCurrentPetName(selectedPet.petName);
      }
    } catch (error) {
      console.error("Error updating pet type:", error);
    }
  };

  return (
    <div className="container absolute inset-x-0 top-0">
      <NavbarUser />
      <div className="row flex justify-center">
        <div className="col-md-auto text-center">
          <h5>สัตว์เลี้ยงที่คุณเลือก: {currentPetName ? `${currentPetName}` : "ยังไม่ได้เลือก"}</h5>
        </div>
      </div>
      <div className="row flex justify-center">
        {petTypes.map((pet) => (
          <div className={`col-md-auto mx-20`} key={pet.petTypeID}>
            <div className="text-center">
              <img
                src={`http://localhost:3001/img/Pets/${pet.petImg}`}
                alt={pet.petName}
                className="img-fluid"
              />
              <button
                type="button"
                className="btn btn-selectpet m-2"
                onClick={() => handlePetTypeChange(pet.petTypeID)}
                disabled={currentPetTypeID === pet.petTypeID}
              >
                {currentPetTypeID === pet.petTypeID ? "เลือกอยู่" : pet.petName}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PetSelect;
