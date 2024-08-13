import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { Form, Row, Col, Button, FormGroup } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Homeicon from "./img/homeicon.png";
import x from "./img/x.png";
import catL from "./img/catL.png";
import "./Login.css";
var md5 = require("md5");

export default function Login() {
  const [validated, setValidated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  let Navigate = useNavigate();

  const getAuthenToken = async () => {
    const response = await fetch("http://localhost:3001/api/authen_request", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        username: md5(username),
      }),
    });

    const data = await response.json();

    console.log(data);
    return data;
  };

  const getAccessToken = async (authToken) => {
    var baseString = username + "&" + md5(password);
    var authenSignature = md5(baseString);

    const response = await fetch("http://localhost:3001/api/access_request", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        authen_signature: authenSignature,
        auth_token: authToken,
      }),
    });

    const data = await response.json();
    return data;
  };

  const doLogin = async () => {
    try {
      const data1 = await getAuthenToken();
      const authToken = data1.data.auth_token;

      const data2 = await getAccessToken(authToken);

      console.log(data2);

      // Store the necessary data in localStorage
      localStorage.setItem("access_token", data2.data.access_token);
      localStorage.setItem("userID", data2.data.account_info.userID);
      localStorage.setItem("username", username);
      localStorage.setItem("displayName", data2.data.account_info.displayName);
      localStorage.setItem("coin", data2.data.account_info.coin);
      localStorage.setItem("pettypeID", data2.data.account_info.pettypeID);
      localStorage.setItem("petName", data2.data.account_info.petName);
      localStorage.setItem("petImg", data2.data.account_info.petImg);
      localStorage.setItem("roleID", data2.data.account_info.roleID);
      localStorage.setItem("roleName", data2.data.account_info.roleName);

      Navigate("/home", { replace: false });
    } catch (error) {
      console.error("Login failed", error);
      throw new Error("Login failed");
    }
  };

  const onLogin = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();

    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      try {
        await doLogin(); // Await the async login function
        setLoginError(""); // Clear the error if login is successful
      } catch (error) {
        setLoginError("Username หรือ Password ไม่ถูกต้อง"); // Set the error if login fails
      }
    }

    setValidated(true);
  };

  return (
    <div className="Login">
      <div class="container absolute inset-x-0 top-0">
        <header class="bg-black p-4"></header>
        <div class="flex justify-start">
          <Link to={"/"}>
            <img src={Homeicon} class="mt-2 " alt="Homeicon" />
          </Link>
        </div>
        <div class="grid grid-flow-row auto-rows-max">
          <div class="flex justify-center">
            <div class="box-border h-[32rem] p-2 border-2 border-black rounded-3xl min-w-[450px]">
              <div class="flex justify-end m-0">
                <Link to={"/"}>
                  <img src={x} class="max-w-10" alt="x" />
                </Link>
              </div>
              <div class="flex justify-center m-0 grid grid-flow-row auto-rows-max">
                <img src={catL} class="max-w-60" alt="catL" />
                <div class="flex justify-center">Login</div>
              </div>
              <div className="container m-auto">
                <Form noValidate validated={validated} onSubmit={onLogin}>
                  <Row className="mb-3">
                    <Form.Group as={Col} controlId="validateUsername">
                      <Form.Label>username</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        placeholder="username"
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
                        placeholder="password"
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
                      {/* <Link to={"/signup"} className="signup-button">
                        Signup
                      </Link> */}
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
