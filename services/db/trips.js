import { getCollection } from './collections.js';

// Get all trips
export const getTrips = async () => {
  const trips = await getCollection('trips').find().toArray();
  return trips;
};

// Get a single trip by id
export const getTrip = async (id) => {
  const trip = await getCollection('trips').findOne({ trip_id: id });
  return trip;
};