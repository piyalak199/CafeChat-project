// import React from "react";
// import { ReactDOM } from "react-dom";
// import "./index.css";
// import reportWebVitals from './reprtWebVitals';
// import { BrowserRouter, Routes, Route } from "react-router-dom";


// import App from "./App";
// import Home from "./Home";
// import Signup from "./Signup";
// import { AuthProvider } from "./AuthContext";
// import Login from "./Login";
// import RoomPage from "./RoomPage";
// import PetSelect from "./PetSelect";

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

// ReactDOM.render(
//   <BrowserRouter>
//     <Routes>
//       <Route path="/login" element={<Login />} />
//       <Route path="/*" element={<App />} />
//       <Route path="/signup" element={<Signup />} />
//       <Route
//         path="/home"
//         element={
//           <AuthProvider>
//             <Home />
//           </AuthProvider>
//         }
//       />
//       <Route path="/roompage" element={<RoomPage />} />
//       <Route path="/petselect" element={<PetSelect />} />
//     </Routes>
//   </BrowserRouter>,
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
import RoomPage from "./RoomPage";
import PetSelect from "./PetSelect";
import DressUp from "./DressUp";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/dressup", element: <DressUp />},
  {
    path: "/home",
    element: (
      <AuthProvider>
        <Home />
      </AuthProvider>
    ),
  },
  { path: "/roompage", element: <RoomPage /> },
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
