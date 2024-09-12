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
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Import all components
import Login from "./Login";
import Signup from "./Signup";
import DressUp from "./DressUp";
import Home from "./Home";
import ChatRoom from "./ChatRoom";
import PetSelect from "./PetSelect";
import App from "./App";

// Create a router with different paths
const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/dressup", element: <DressUp /> },
  { path: "/home", element: <Home /> },
  { path: "/chatroom", element: <ChatRoom /> },
  { path: "/chatroom/:roomID", element: <ChatRoom /> },
  { path: "/petselect", element: <PetSelect /> },

]);

// Create root for rendering
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
