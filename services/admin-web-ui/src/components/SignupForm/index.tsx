import React, { useState } from "react";
import "./index.css";

const SignupForm: React.FC = () => {
	const [username, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await fetch("http://localhost:1337/api/v1/auth/admin/signup", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ username, email, password }),
			});
			const data = await response.json();
			if (response.ok) {
				// Handle successful signup
				console.log("Signup successful", data);
			} else {
				// Handle signup error
				console.error("Signup failed", data);
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	return (
		<form className="signup-form" onSubmit={handleSubmit}>
			<div>
				<label htmlFor="username">Name</label>
				<input
					type="text"
					id="username"
					name="username"
					value={username}
					onChange={(e) => setName(e.target.value)}
					required
				/>
			</div>
			<div>
				<label htmlFor="email">Email</label>
				<input
					type="email"
					id="email"
					name="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
			</div>
			<div>
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
			<button type="submit">Sign up</button>
		</form>
	);
};

export default SignupForm;
