import React, { useEffect } from "react";

const Login: React.FC = () => {
	const uri = "http://localhost:1337/auth/user";
	const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
	const path = "/profile";
	console.log(clientId);
	useEffect(() => {
		document.title = "Login - Avec";
	}, []);
	return (
		<div>
			<a
				href={`https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${uri}?path=${path}&scope=user:email`}>
				Login with GitHub
			</a>
		</div>
	);
};

export default Login;
