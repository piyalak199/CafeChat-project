import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import Homeicon from "./img/homeicon.png";
import x from "./img/x.png";
import catL from "./img/catL.png";
import FontSignup from "./img/FontSignup.png";
import btSignup from "./img/btSignup.png";

import { API_GET, API_POST } from "./api";

export default function Signup() {
  let params = useParams();

  const [userID, setUserID] = useState(0);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState(2);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    async function fetchData(userID,) {
      let json = await API_POST("Register/" + userID);

      var data = json.data[0];

      setUserID(data.userID);
      setUsername(data.username);
      setPassword(data.password);
      setRole(data.roleID);
    }

    if (params.userID != "add") {
      fetchData([params.userID]);
    }
  }, [params.userID]);

  const onSave = (event) => {
    const form = event.currentTarget;
    event.preventDefault();

    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else if (params.userID == "add") {
      createUser();
    }

    setValidated(true);
  };

  const createUser = async () => {
    const response = await fetch("http://localhost:3001/api/Register/add", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
      body: JSON.stringify({
        username: username,
        password: password,
        roleID: role,
      }),
    });
    let json = await response.json();
    if (json.result) {
      window.location = "/";
    }
  };

  return (
    <div className="Signup">
      <div class="container absolute inset-x-0 top-0">
        <header class="bg-black p-4"></header>
        <div class="flex justify-start">
          <Link to={"/"}>
            <img src={Homeicon} class="mt-2 " alt="Homeiocn" />
          </Link>
        </div>
        <div class="grid grid-flow-row auto-rows-max">
          <div class="flex justify-center">
            <Form>
              <div class="box-border h-[32rem] p-2 border-2 border-black rounded-3xl min-w-[450px]">
                <p class="flex justify-end m-0">
                  <Link to={"/"}>
                    <img src={x} class="max-w-10" alt="x" />
                  </Link>
                </p>
                <p class="flex justify-center m-0 grid grid-flow-row auto-rows-max">
                  <img src={catL} class="max-w-60" alt="catL" />
                  <p class="flex justify-center">
                    <img src={FontSignup} class="max-w-20" alt="FontSignup" />
                  </p>
                </p>

                 {/* form */}
                <Form.Group as={Col} controlId="validateUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="Username"
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <Form.Control.Feedback
                    style={{ margin: "-22px 0 0 65px" }}
                    type="invalid"
                  >
                    กรุณากรอก Username
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} controlId="validatePassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    required
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Form.Control.Feedback
                    style={{ margin: "0px 0 0px -350px" }}
                    type="invalid"
                  >
                    กรุณากรอก Password
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} controlId="validateConfirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    required
                    type="Confirm Password"
                    placeholder="Confirm Password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <Form.Control.Feedback
                    style={{ margin: "0px 0 0px -350px" }}
                    type="invalid"
                  >
                    กรุณายืนยัน Password
                  </Form.Control.Feedback>
                </Form.Group>

                <Row className="mb-3">
                  <Button
                    variant="primary"
                    as="input"
                    type="submit"
                    value="SAVE"
                  />
                </Row>
                {/* <Link to={`/`}>
                  <p class="flex justify-center mt-10">
                    <img src={btSignup} class="max-w-96" alt="btSignup" />
                  </p>
                </Link> */}
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
