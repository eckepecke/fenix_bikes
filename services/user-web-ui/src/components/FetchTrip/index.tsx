// Define the User type
interface Trip {
  _id: string;
  trip_id?: string;
  start_time: Date;
  end_time: Date;
  start_location: Array<number>;
  end_location: Array<number>;
}

// Fetch trip data
const FetchTrip = async (tripId: string): Promise<Trip | null> => {
  try {
    const response = await fetch(`http://localhost:1337/get/trip/${tripId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const trip: Trip = await response.json();

    // Check if the trip ID matches
    return trip.trip_id === tripId ? trip : null;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

export type { Trip };
export { FetchTrip };