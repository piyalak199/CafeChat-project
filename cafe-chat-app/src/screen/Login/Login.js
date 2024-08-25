import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { Form, Row, Col, Button, FormGroup } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

var md5 = require("md5");

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [validated, setValidated] = useState(false);
  const [loginError, setLoginError] = useState("");

  const onLogin = async (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);

    if (form.checkValidity() === true) {
      event.preventDefault();
      const hashedPassword = md5(password);

      try {
        const response = await fetch("/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            password: hashedPassword,
          }),
        });
        const data = await response.json();

        if (data.result) {
          // Handle successful login, e.g., redirect or update UI
          console.log("Login successful!");
        } else {
          // Handle login error
          setLoginError(data.message);
        }
      } catch (error) {
        setLoginError("An error occurred during login.");
      }
    }
  };

  return (
    <div className="Login">
      <div class="container absolute inset-x-0 top-0">
        <header class="bg-black p-4"></header>
        <div class="flex justify-start">
          <Link to={"/"}>
            <img src={"./img/homeicon.png"} class="mt-2 " alt="Homeicon" />
          </Link>
        </div>
        <div class="grid grid-flow-row auto-rows-max">
          <div class="flex justify-center">
            <div class="box-border h-[32rem] p-2 border-2 border-black rounded-3xl min-w-[450px]">
              <div class="flex justify-end m-0">
                <Link to={"/"}>
                  <img src={"./img/x.png"} class="max-w-10" alt="x" />
                </Link>
              </div>
              <div class="flex justify-center m-0 grid grid-flow-row auto-rows-max">
                <img src={"./img/catL.png"} class="max-w-60" alt="catL" />
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
