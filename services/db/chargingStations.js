import { getCollection } from './collections.js';

// All parking zones
export const getAllChargingStations = async () => {
  const chargingStations = await getCollection('charging_stations').find().toArray();

  return chargingStations;
};

// TODO: chargingStations zones in a specific city
export const getChargingStations = async (city) => {
  const cityLower = city.toLowerCase();
  const chargingStations = await getCollection('charging_stations').find({
    $expr: {
      $eq: [{ $toLower: "$city_name" }, cityLower]
    }
  }).toArray();

  return chargingStations;
};
