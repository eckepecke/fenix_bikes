import React from "react";
import { FetchTrip, Trip } from "../FetchTrip";

import "./index.css";

interface TripProps {
  tripId: string;
}

const TripDetails: React.FC<TripProps> = ({ tripId }) => {
  const [trip, setTrip] = React.useState<Trip | null>(null);

  React.useEffect(() => {
    FetchTrip(tripId).then(fetchedTrip => {
      setTrip(fetchedTrip);
      
    });
  }, [tripId]);

  if (!trip) {
    return <div>Loading...</div>;
  }

  const formattedDate = new Date(trip.end_time).toLocaleDateString();
  const durationMs = new Date(trip.end_time).getTime() - new Date(trip.start_time).getTime();
  const durationMin = Math.floor(durationMs / 60000);
  const startTime = new Date(trip.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const endTime = new Date(trip.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formattedDuration = `${durationMin} minutes (${startTime}-${endTime})`;
  const formattedCost = (trip.cost ?? 0).toString();

  return (
    <div className="trip-details">
      <h1 className="trip-heading">{formattedDate}</h1>
      <p className="trip-p">Trip ID: {tripId}</p>
      <p className="trip-p">Duration: {formattedDuration}</p>
      <p className="trip-p">Total: {formattedCost} SEK</p>

      <a href={`/pay/${tripId}`} className="trip-link">Payment &gt;</a>
    </div>
  );
}

export default TripDetails;