import React from "react";
import { createRoot } from "react-dom/client";
import { Router, Routes, Route, BrowserRouter } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import { StrictMode } from "react";

import AdminLogin from "./routes/ProductCredential/signin";
import AdminRegistration from "./routes/ProductCredential/Registration";
import AdminProducts from "./routes/ProductCredential/AdminProducts";
import "./routes/Home.css";
import Home from "./routes/Home";
import Signup from "./routes/Signup";
import Login from "./routes/Login";
import Cart from "./routes/Cart";
import MyOrder from "./routes/MyOrder";
import AboutUs from "./routes/AboutUs";
import ContactUs from "./routes/ContactUs";
import Product from "./routes/Product";
import NotFound from "./routes/NotFound";
import AddProducts from "./routes/AddProducts";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order" element={<MyOrder />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/adminLog" element={<AdminLogin />} />
        <Route path="/adminReg" element={<AdminRegistration />} />
        <Route path="/Product" element={<Product />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/add-products" element={<AddProducts />} />
        <Route path="/adminPage" element={<AdminProducts />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

reportWebVitals();
