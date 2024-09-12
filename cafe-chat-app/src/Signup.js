import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect, Component } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from 'axios'; // ใช้ Axios แทน fetch

import Login from "./Login.js";

import catL from "./img/Login/catL.png"
import homeicon from "./img/Home/homeicon.png";

export default function Signup() {
  let params = useParams();
  const navigate = useNavigate();

  const [userID, setUserID] = useState(0);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState(1);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    async function fetchData(userID) {
      try {
        let response = await axios.post(`http://localhost:3001/api/Register/${userID}`);
        let data = response.data[0];

        setUserID(data.userID);
        setUsername(data.username);
        setPassword(data.password);
        setRole(data.roleID); 
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }

    if (params.userID !== "add") {
      fetchData(params.userID);
    }
  }, [params.userID]);

  const onSave = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    setValidated(true);

    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      createUser();
    }
  };

  const createUser = async () => {
    try {
      const response = await axios.post("http://localhost:3001/api/Register/add", {
        username: username,
        password: password,
        roleID: role,
      }, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      });

      if (response.data.result) {
        navigate("/");
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };
  return(
    <div className="Signup">
        <div className="container absolute inset-x-0 top-0">
          <header className="bg-black p-4"></header>
          <div className="flex justify-start">
            <Link to={"/"}>
              <img src={homeicon} className="mt-2 " alt="Homeicon" />
            </Link>
          </div>
          <div className="grid grid-flow-row auto-rows-max">
            <div className="flex justify-center">
              <Form noValidate validated={validated} onSubmit={onSave}>
                <div className="box-border h-[32rem] p-2 border-2 border-black rounded-3xl min-w-[450px]">
                  <p className="flex justify-end m-0">
                    <Link to={"/"}>
                      X
                    </Link>
                  </p>
                  <p className="flex justify-center m-0 grid-flow-row auto-rows-max">
                    <img src={catL} className="max-w-60" alt="catL" />
                    <p className="flex justify-center">
                      Signup
                    </p>
                  </p>
  
                  <Form.Group as={Col} controlId="validateUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">
                      กรุณากรอก Username
                    </Form.Control.Feedback>
                  </Form.Group>
  
                  <Form.Group as={Col} controlId="validatePassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      required
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">
                      กรุณากรอก Password
                    </Form.Control.Feedback>
                  </Form.Group>
  
                  <Form.Group as={Col} controlId="validateConfirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      required
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">
                      กรุณายืนยัน Password
                    </Form.Control.Feedback>
                  </Form.Group>
  
                  <Row className="mb-3">
                    <Button
                      variant="primary"
                      type="submit"
                      value="SAVE"
                    >
                      SAVE
                    </Button>
                  </Row>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    )
}

 
  
