import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

const CheckAuth = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      setShowModal(true);
      setTimeout(() => {
        navigate("/login");
      }, 8000);
    }
  }, [navigate]);

  const handleClose = () => setShowModal(false);

  if (!isAuthenticated) {
    return (
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title> คุณยังไม่ลงชื่อเข้าใช้ </Modal.Title>
        </Modal.Header>
        <Modal.Body> กรุณาลงชื่อเข้าใช้ก่อน !!! </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => navigate("/login")}>
            กลับไปลงชื่อเข้าใช้
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  // If authenticated, render the children (protected content)
  return <>{children}</>;
};

export default CheckAuth;
