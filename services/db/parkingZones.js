import { getCollection } from './collections.js';

// All parking zones
export const getParking = async () => {
  const parking = await getCollection('parking_zones').find().toArray();

  return parking;
};

// TODO: Parking zones in a specific city
export const getParkingInCity = async (city) => {

};
