import { getCollection } from './collections.js';

export const getCities = async () => {
  const cities = await getCollection('cities').find().toArray();
  return cities;
};

export const insertCity = async (city) => {
  const result = await getCollection('cities').insertOne(city);
  return result;
}