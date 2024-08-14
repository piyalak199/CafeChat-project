// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import {
//   BrowserRouter,
//   Routes,
//   Route,
// } from "react-router-dom";

// import App from "./App";
// import Login from "./Login";
// import Home from "./Home";
// import Signup from "./Signup";

// ReactDOM.render(
//   <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<App />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/home" element={<Home />} />
//         <Route path="/signup" element={<Signup />} />
//       </Routes>
//     </BrowserRouter>,
//   document.getElementById('root')
// );

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// import TestState from "./TestState";
import { AuthProvider } from "./AuthContext";
import Login from "./Login";
import Signup from "./Signup";
import Home from "./Home";
import PetSelect from "./PetSelect";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/home", element: <Home /> },
  { path: "/petselect", element: <PetSelect /> },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
