import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

const Home = lazy(() => import("../pages/lazy/Home"));
const About = lazy(() => import("../pages/lazy/About"));
const Customers = lazy(() => import("../pages/lazy/Customers"));
const Products = lazy(() => import("../pages/lazy/Products"));
const NotFound = lazy(() => import("../pages/lazy/NotFound"));
const Login = lazy(() => import("../pages/lazy/Login"));
const Claims = lazy(() => import("../pages/lazy/Claims"));
const Reports = lazy(() => import("../pages/lazy/Reports"));

export default function AppRoutes() {
    const auth_user_id = localStorage.getItem("auth_user_id");
    const isLoggedIn = !!auth_user_id;

    return (
        <Suspense fallback={<div>กำลังโหลด...</div>}>
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route
                    path="/"
                    element={isLoggedIn ? <Home /> : <Navigate to="/login" />}
                />
                <Route
                    path="/home"
                    element={isLoggedIn ? <Home /> : <Navigate to="/login" />}
                />
                <Route
                    path="/about"
                    element={isLoggedIn ? <About /> : <Navigate to="/login" />}
                />
                <Route
                    path="/customers"
                    element={isLoggedIn ? <Customers /> : <Navigate to="/login" />}
                />
                <Route
                    path="/products"
                    element={isLoggedIn ? <Products /> : <Navigate to="/login" />}

                />
                <Route path="/claims" element={<Claims />} />

                <Route path="*" element={<NotFound />} />
                <Route
                    path="/reports"
                    element={isLoggedIn ? <Reports /> : <Navigate to="/login" />}
                />

            </Routes>
        </Suspense>
    );
}
