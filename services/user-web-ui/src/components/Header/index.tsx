import React from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import "./index.css";

const Header: React.FC = () => {
  const [cookies, , removeCookie] = useCookies(["user"]);
  const navigate = useNavigate();

  const handleLogout = () => {
    removeCookie("user");
    navigate("/");
  };

	return (
		<header className="header">
			<div className="header-wrapper">
				<div className="logo">
					<a href="/">
						<img src="src/assets/avec-logo.svg" alt="Logo" />
					</a>
				</div>
				<nav className="navigation">
					<ul>
						{cookies.user ? (
							<>
								<li>
									<a href="ride-history">Ride History</a>
								</li>
								<li>
									<a href="profile">Profile</a>
								</li>
								<li>
									<a href="payments">Payments</a>
								</li>
								<li>
									<button onClick={handleLogout}>Sign out</button>
								</li>
							</>
						) : (
							<li>
								<a href="login">Sign in</a>
							</li>
						)}
					</ul>
				</nav>
			</div>
		</header>
	);
};

export default Header;
