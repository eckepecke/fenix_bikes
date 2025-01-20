import React from "react";
import "./index.css";

const Footer: React.FC = () => {
	return (
		<footer className="footer">
			<div className="footer-wrapper">
				<ul>
					<li>
						<a href="/">Home</a>
					</li>
				</ul>
			</div>
			<p>&copy; Copyright 2024 – Fenix, Inc.</p>
		</footer>
	);
};

export default Footer;
