import React, { useEffect } from "react";
import SignupForm from "../../components/SignupForm";
import "./index.css";

const Signup: React.FC = () => {
  useEffect(() => {
    document.title = "Signup - Avec";
  }, []);

  return (
    <div className="signup-container">
      <h1>Signup</h1>
      <SignupForm />
    </div>
  );
};

export default Signup;