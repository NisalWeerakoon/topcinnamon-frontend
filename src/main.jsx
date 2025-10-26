import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx"; // your login/signup page
import Cart from "./pages/Cart.jsx"; // the new cart page
import "./Style.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />  {/* your login/signup */}
        <Route path="/cart" element={<Cart />} /> {/* cart page */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
