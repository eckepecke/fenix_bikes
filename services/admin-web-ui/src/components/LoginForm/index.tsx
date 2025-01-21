import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

const LoginForm: React.FC = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await fetch("http://localhost:1337/api/v1/auth/admin/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
			});
			const data = await response.json();
			if (response.ok) {
				// Save token to localStorage
				localStorage.setItem("token", data.token);
				// Handle successful login
				console.log("Login successful", data);
				navigate("/maps");

			} else {
				// Handle login error
				console.error("Login failed", data);
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	return (
		<form className="login-form" onSubmit={handleSubmit}>
			<div className="login-field">
				<label htmlFor="email">Email</label>
				<input
					type="text"
					id="email"
					name="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
			</div>
			<div className="login-field">
				<label htmlFor="password">Password</label>
				<input
					type="password"
					id="password"
					name="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>
			</div>
			<button type="submit" className="green-btn">Log in</button>
		</form>
	);
};

export default LoginForm;
