

import React, { useState } from "react";
import { registerUser } from "./api";

const Register = () => {
    const [formData, setFormData] = useState({
        email: "",
        username: "",
        password: ""
    });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        
        try {
            const response = await registerUser(formData);
            setMessage(response.data.message || "Registration successful! Please check your email to verify your account.");
        } catch (err) {
            setError(err.response?.data?.error || "Registration failed");
        }
    };

    return (
        <div className="register-form">
            <h2>REGISTRATION</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Enter your Email"
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="reg-username">Username</label>
                    <input
                        type="text"
                        name="username"
                        id="reg-username"
                        placeholder="Choose a Username"
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="reg-password">Password</label>
                    <input
                        type="password"
                        name="password"
                        id="reg-password"
                        placeholder="Create a Password"
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="register-btn">Register</button>
                
                {error && <p className="error-message">{error}</p>}
                {message && <p className="success-message">{message}</p>}
                
                <p className="login-link">
                    Already have an account? <a href="#" onClick={() => document.getElementById('login-button').click()}>Login here</a>
                </p>
            </form>
        </div>
    );
};

export default Register;