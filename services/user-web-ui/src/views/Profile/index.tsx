import React, { useEffect } from "react";
import UserDetails from "../../components/UserDetails";

const RideHistory: React.FC = () => {
	useEffect(() => {
		document.title = "Profile - Avec";
}, []);
	return (
		<div>
			<h1>Profile</h1>
			<UserDetails />
		</div>
	);
};

export default RideHistory;
