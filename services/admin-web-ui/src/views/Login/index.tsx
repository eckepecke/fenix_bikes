import React, { useEffect } from "react";
import LoginForm from "../../components/LoginForm";
import "./index.css";

const Login: React.FC = () => {
  useEffect(() => {
    document.title = "Login - Avec";
  }, []);

  return (
    <div className="login-container">
      <h1>Login</h1>
      <LoginForm />
    </div>
  );
};

export default Login;