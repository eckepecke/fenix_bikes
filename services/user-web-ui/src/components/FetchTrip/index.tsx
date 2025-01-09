// Define the User type
interface Trip {
  _id: string;
  trip_id?: string;
  start_time: Date;
  end_time: Date;
  start_location: Array<number>;
  end_location: Array<number>;
  cost?: number;
}

// Fetch trip data
const FetchTrip = async (tripId: string): Promise<Trip | null> => {
  try {
    const tripResponse = await fetch(`http://localhost:1337/get/trip/${tripId}`);
    if (!tripResponse.ok) {
      throw new Error(`HTTP error! status: ${tripResponse.status}`);
    }

    const trip: Trip = await tripResponse.json();

    const tripCostResponse = await fetch(`http://localhost:1337/trip/calculate/${tripId}`);

    if (!tripCostResponse.ok) {
      throw new Error(`HTTP error! status: ${tripCostResponse.status}`);
    }

    const tripCost = await tripCostResponse.json();
    trip.cost = tripCost;
    
    
    // Check if the trip ID matches
    return trip.trip_id === tripId ? trip : null;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

export type { Trip };
export { FetchTrip };