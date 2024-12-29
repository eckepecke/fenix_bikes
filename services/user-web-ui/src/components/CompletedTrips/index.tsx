import React, { useEffect, useState } from "react";
import { User, FetchUser } from "../FetchUser";
import TripDetails from "../Trip";
import "./index.css";

const CompletedTrips: React.FC = () => {
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
		<div className="completed-trips">
			{user.completed_trips.length > 0 ? (
				user.completed_trips.map((trip, index) => <TripDetails key={index} tripId={trip} />)
			) : (
				<p>No rides yet.</p>
			)}
		</div>
	);
};

export default CompletedTrips;
