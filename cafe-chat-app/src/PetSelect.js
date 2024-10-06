// import React, { useEffect, useState } from "react";
// import { API_GET } from "./api"; // นำเข้า API_GET จากไฟล์ api.js

// const PetSelect = () => {
//     const [petTypes, setPetTypes] = useState([]); // สร้าง state สำหรับเก็บข้อมูล pet types
//     const [loading, setLoading] = useState(true); // สร้าง state สำหรับเก็บสถานะการโหลดข้อมูล
//     const [error, setError] = useState(null); // สร้าง state สำหรับเก็บ error

//     // ฟังก์ชันเรียก API เพื่อดึงข้อมูลประเภทสัตว์
//     useEffect(() => {
//         const fetchPetTypes = async () => {
//             try {
//                 setLoading(true); // เริ่มโหลดข้อมูล
//                 const response = await API_GET("pettype"); // เรียก API ที่ url pettype
//                 setPetTypes(response.data || []); // ถ้าข้อมูลมีใน response.data ก็เซตให้กับ state
//             } catch (err) {
//                 setError(err.message); // ถ้ามี error จัดเก็บใน state error
//             } finally {
//                 setLoading(false); // จบการโหลดข้อมูลไม่ว่าจะสำเร็จหรือไม่
//             }
//         };

//         fetchPetTypes(); // เรียกฟังก์ชัน fetch เมื่อ component ถูก mount
//     }, []); // [] ทำให้ useEffect เรียกเพียงครั้งเดียวหลังจาก render

//     return (
//         <div>
//             <h1>Select Your Pet</h1>
//             {loading ? (
//                 <p>Loading...</p> // แสดงข้อความขณะกำลังโหลดข้อมูล
//             ) : error ? (
//                 <p>Error: {error}</p> // แสดงข้อความเมื่อมี error
//             ) : petTypes.length > 0 ? (
//                 <ul>
//                     {petTypes.map((petType) => (
//                         <li key={petType.id}>{petType.name}</li> // แสดงข้อมูลประเภทสัตว์
//                     ))}
//                 </ul>
//             ) : (
//                 <p>No pet types available.</p> // แสดงเมื่อไม่มีข้อมูล
//             )}
//         </div>
//     );
// };

// export default PetSelect;
