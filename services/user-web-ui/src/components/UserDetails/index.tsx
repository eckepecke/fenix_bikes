import React, { useEffect, useState } from "react";
import { User, FetchUser } from "../FetchUser";

const UserDetails: React.FC = () => {
	const [user, setUser] = useState<User | null>(null);
	const userId = "6765617d4cd3ac975e5ca6fd"; // Replace with the desired user ID

	useEffect(() => {
		const getUser = async () => {
			const fetchedUser = await FetchUser(userId);
			setUser(fetchedUser);
		};

		getUser();
	}, [userId]);

	if (!user) {
		return <p>Loading user data...</p>;
	}

	return (
		<div>
			<p>
				<strong>Name:</strong> {user.name}
			</p>
			<p>
				<strong>Email:</strong> {user.email}
			</p>
			<p>
				<strong>Payment Method:</strong> {user.payment_method}
			</p>
			<p>
				<strong>Banned:</strong> {user.banned ? "Yes" : "No"}
			</p>
			<p>
				<strong>Completed Trips:</strong>{" "}
				{user.completed_trips.length > 0 ? user.completed_trips.join(", ") : "No trips completed"}
			</p>
		</div>
	);
};

export default UserDetails;
