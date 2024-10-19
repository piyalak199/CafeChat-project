
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Import all components
import Login from "./Login";
import Signup from "./Signup";
import Home from "./Home";
import ChatRoom from "./ChatRoom";
import PetSelect from "./PetSelect";
import App from "./App";
import CheckAuth from "./CheckAuth";
import ShopHat from "./ShopHat";
import ShopCloth from "./ShopCloth";
import AddCoin from "./AddCoin"
import GetHats from "./GetHats";
import GetDressed from "./GetDressed";

// Create a router with different paths
const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/gethats", element: (<CheckAuth><GetHats /></CheckAuth>) },
  { path: "/getdressed", element: (<CheckAuth><GetDressed /></CheckAuth>) },
  { path: "/shophat", element: (<CheckAuth><ShopHat /></CheckAuth>) },
  { path: "/shopcloth", element: (<CheckAuth><ShopCloth /></CheckAuth>) },
  { path: "/home", element: (<CheckAuth><Home /></CheckAuth>) },
  { path: "/chatroom", element: (<CheckAuth><ChatRoom /></CheckAuth>)},
  { path: "/chatroom/:roomID", element:(<CheckAuth>< ChatRoom/></CheckAuth>)},
  { path: "/petselect", element: (<CheckAuth><PetSelect /></CheckAuth>) },
  { path: "/addcoin", element: (<CheckAuth><AddCoin /></CheckAuth>) },
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
