import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

function AdminLogin() {
    const [loginInfo, setLoginInfo] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setLoginInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!loginInfo.email || !loginInfo.password) {
            return handleError("Email and password are required");
        }

        try {
            const payload = {
                email: loginInfo.email,
                password: loginInfo.password,
                role: "admin",
            };
            console.log("Sending login data:", payload);

            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await response.json();
            console.log("Login Response:", result);

            if (response.ok && result.success) {
                handleSuccess(result.message);
                setTimeout(() => navigate("/home"), 1000);
            } else {
                handleError(result.message || "Login failed");
            }
        } catch (err) {
            handleError(err.message);
        }
    };

    return (
        <div className="container">
            <h1>Admin Login</h1>
            <form onSubmit={handleLogin}>
                <input type="email" name="email" placeholder="Email" onChange={handleChange} />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} />
                <button type="submit">Login</button>
            </form>
            <ToastContainer />
        </div>
    );
}

export default AdminLogin;
