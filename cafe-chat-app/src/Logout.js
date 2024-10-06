import { useNavigate } from "react-router-dom";

const Logout = () => {
  let navigate = useNavigate();

  const handleLogout = () => {
    // ลบข้อมูลการเข้าสู่ระบบจาก localStorage
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("username");
    localStorage.removeItem("display_name");
    localStorage.removeItem("coin");
    localStorage.removeItem("pettypeID");
    localStorage.removeItem("petName");
    localStorage.removeItem("petImg");
    localStorage.removeItem("roleID");
    localStorage.removeItem("roleName");

    // นำผู้ใช้ไปยังหน้า login
    navigate("/login", { replace: true });
  };

  return { handleLogout }; // ส่งฟังก์ชันกลับ
};

export default Logout;
