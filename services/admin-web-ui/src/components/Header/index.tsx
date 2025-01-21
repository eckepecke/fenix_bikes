import React from "react";
import "./index.css";
import logo from "../../assets/fenix-logo.svg";

const Header: React.FC = () => {
	return (
		<header className="header">
			<div className="header-wrapper">
				<div className="logo">
					<a href="/">
					<img src={logo} alt="Logo" />
					</a>
				</div>
				<nav className="navigation">
					<ul>
						<li>
							<a href="/bikes/add">Add bike</a>
						</li>
						<li>
							<a href="/maps">Maps</a>
						</li>
						<li>
							<a href="/users">Users</a>
						</li>
					</ul>
				</nav>
			</div>
		</header>
	);
};

export default Header;
