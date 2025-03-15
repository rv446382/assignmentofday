import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

function AdminSignup() {
    const [signupInfo, setSignupInfo] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSignupInfo((prev) => ({ ...prev, [name]: value }));
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        const { firstName, lastName, email, password } = signupInfo;
        if (!firstName || !lastName || !email || !password) {
            return handleError("All fields are required");
        }
        try {
            const response = await fetch(`${API_BASE_URL}/auth/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...signupInfo, role: "admin" }),
            });
            const result = await response.json();
            console.log(result)
            if (result.success) {
                handleSuccess(result.message);
                setTimeout(() => navigate("/admin-login"), 1000);
            } else {
                handleError(result.message);
            }
        } catch (err) {
            handleError(err.message);
        }
    };

    return (
        <div className="container">
            <h1>Admin Signup</h1>
            <form onSubmit={handleSignup}>
                <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} />
                <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} />
                <input type="email" name="email" placeholder="Email" onChange={handleChange} />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} />
                <button type="submit">Signup</button>
                <span>Already have an account? <Link to="/admin-login">Login</Link></span>
            </form>
            <ToastContainer />
        </div>
    );
}

export default AdminSignup;
