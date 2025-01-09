import React from "react";
import { User } from "../FetchUser";
import TripDetails from "../TripDetails";
import "./index.css";

interface CompletedTripsProps {
  user: User | null;
}

const CompletedTrips: React.FC<CompletedTripsProps> = ({ user }) => {
  if (!user) {
    return <p>Loading user data...</p>;
  }

  return (
    <div className="completed-trips">
      {user.completed_trips.length > 0 ? (
        user.completed_trips.map((trip, index) => (
          <TripDetails key={index} tripId={trip} />
        ))
      ) : (
        <p>No rides yet.</p>
      )}
    </div>
  );
};

export default CompletedTrips;
