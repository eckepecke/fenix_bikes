import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faFacebook } from "@fortawesome/free-brands-svg-icons";
import "./index.css";

const Login: React.FC = () => {
	const uri = "http://localhost:1337/api/v1/auth/user";
	const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
	const path = "/profile";
	console.log(clientId);
	useEffect(() => {
		document.title = "Login - Fenix";
	}, []);
	return (
		<>
			<div className="login-container">
				<h1 className="heading">Sign in</h1>
				<a
					className="login-btn"
					href={`https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${uri}?path=${path}&scope=user:email`}>
					<FontAwesomeIcon icon={faGithub} /> Sign in with GitHub
				</a>
				<p className="signup-description">
					If you're not already a member, you'll be signed up automatically.
				</p>
			</div>
		</>
	);
};

export default Login;
