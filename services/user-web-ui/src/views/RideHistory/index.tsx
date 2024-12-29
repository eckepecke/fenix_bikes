import React, { useEffect } from "react";
import CompletedRides from '../../components/CompletedTrips';

const RideHistory: React.FC = () => {
	useEffect(() => {
		document.title = "Ride History - Avec";
}, []);
	return (
		<div>
			<h1>Ride History</h1>
      <p>Overview of your past rides.</p>
			<CompletedRides />
		</div>
	);
};

export default RideHistory;
