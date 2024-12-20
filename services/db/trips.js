import { getCollection } from './collections.js';

export const getTrips = async () => {
  const trips = await getCollection('trips').find().toArray();
  return trips;
};