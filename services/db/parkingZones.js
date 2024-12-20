import { getCollection } from './collections.js';

// All parking zones
export const getAllParking = async () => {
  const parking = await getCollection('parking_zones').find().toArray();

  return parking;
};

// TODO: Parking zones in a specific city
export const getParking = async (city) => {
  const cityLower = city.toLowerCase();
  const parking = await getCollection('parking_zones').find({
    $expr: {
      $eq: [{ $toLower: "$city_name" }, cityLower]
    }
  }).toArray();

  return parking;
};
