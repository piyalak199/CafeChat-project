import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { API_POST } from "./api"; // ใช้ฟังก์ชัน API_POST จาก api.js
import homeicon from "./img/Home/homeicon.png";
import catL from "./img/Login/catL.png";
import md5 from "md5"; // นำเข้า md5 สำหรับการแฮชรหัสผ่าน
import "./Login.css";

function Login() {
  const [validated, setValidated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  let navigate = useNavigate();

  const onLogin = (event) => {
    const form = event.currentTarget;
    event.preventDefault();

    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      doLogin();
    }

    setValidated(true);
  };

  const getAuthenToken = async () => {
    try {
      const data = await API_POST("authen_request", {
        username: md5(username), // ส่งค่า username ด้วย md5
      });

      return data;
    } catch (error) {
      console.error("Authentication request failed:", error);
      setLoginError("failed");
    }
  };

  const getAccessToken = async (authToken) => {
    try {
      const authenSignature = md5(username + "&" + md5(password));

      const data = await API_POST("access_request", {
        authen_signature: authenSignature,
        auth_token: authToken,
      });

      return data;
    } catch (error) {
      console.error("Access request failed:", error);
      setLoginError("failed");
    }
  };

  const doLogin = async () => {
    const authData = await getAuthenToken();

    if (authData && authData.result) {
      const accessData = await getAccessToken(authData.data.auth_token);

      if (accessData && accessData.result) {
        // เก็บโทเค็นและข้อมูลผู้ใช้ลงใน localStorage
        localStorage.setItem("access_token", accessData.data.access_token);
        localStorage.setItem("userID", accessData.data.account_info.userID);
        localStorage.setItem("username", accessData.data.account_info.username);
        localStorage.setItem(
          "displayName",
          accessData.data.account_info.displayName
        );
        localStorage.setItem("coin", accessData.data.account_info.coin);
        localStorage.setItem(
          "petTypeID",
          accessData.data.account_info.petTypeID
        );
        localStorage.setItem("roleID", accessData.data.account_info.roleID);

        navigate("/home", { replace: true });
      } else {
        setLoginError("ไม่สามารถเข้าสู่ระบบได้ โปรดลองอีกครั้ง");
      }
    } else {
      setLoginError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
    }
  };

  return (
    <div className="Login">
      <div className="container absolute inset-x-0 top-0">
        <header className="bg-black"></header>
        <nav className="navbar">
          <div className="container-fluid">
            <div className="row w-100 h-16 align-items-center justify-content-between">
              {/* Home Icon */}
              <Link className="col-auto">
                <img
                  src={homeicon}
                  className="home-icon"
                  alt="Home icon"
                  onClick={() => navigate("/")}
                />
              </Link>
            </div>
          </div>
        </nav>
        <div className="grid grid-flow-row auto-rows-max">
          <div className="flex justify-center">
            <div className="box-border h-[32rem] p-2 border-2 border-black rounded-3xl min-w-[450px]">
              <div className="flex justify-end m-0">
                <button
                  type="button"
                  class="btn-close "
                  aria-label="Close"
                  onClick={() => navigate("/")}
                ></button>
              </div>
              <div className="flex justify-center m-0 grid-flow-row auto-rows-max">
                <img src={catL} className="max-w-60" alt="catL" />
                <div className="flex justify-center">Login</div>
              </div>
              <div className="container m-auto">
                <Form noValidate validated={validated} onSubmit={onLogin}>
                  <Row className="mb-3">
                    <Form.Group as={Col} controlId="validateUsername">
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        placeholder="Username"
                        onChange={(e) => setUsername(e.target.value)}
                      />
                      <Form.Control.Feedback type="invalid">
                        กรุณากรอก username
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Row>
                  <Row className="mb-3">
                    <Form.Group as={Col} controlId="validatePassword">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        required
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <Form.Control.Feedback type="invalid">
                        กรุณากรอก password
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Row>
                  {loginError && (
                    <div style={{ color: "red", marginBottom: "10px" }}>
                      {loginError}
                    </div>
                  )}
                  <Row>
                    <Col md={3}>
                      <button type="submit" className="login-button">
                        Login
                      </button>
                    </Col>
                  </Row>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
