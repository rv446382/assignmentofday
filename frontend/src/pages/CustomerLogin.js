import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

function CustomerLogin() {
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;

    if (!email || !password) {
      return handleError("All fields are required");
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      console.log("result", result);

      if (result.success) {
        handleSuccess("Login successful!");
        localStorage.setItem("token", result.jwtToken); // Store JWT for authentication
        navigate("/dashboard"); // Redirect to dashboard or homepage
      } else {
        handleError(result.message);
      }
    } catch (error) {
      console.error("Login Error:", error);
      handleError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="container">
      <h1>Customer Login</h1>
      <form onSubmit={handleLogin}>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} />
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <Link to="/signup">Signup</Link>
      </p>
      <ToastContainer />
    </div>
  );
}

export default CustomerLogin;
