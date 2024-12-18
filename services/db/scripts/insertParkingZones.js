import { config } from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import { readFileSync } from "fs";

config();

const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const uri = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.k5lbc.mongodb.net/fenix?retryWrites=true&w=majority&appName=Cluster0`;

const city = "lund"; // The name of the city in the data file
const cityName = "Lund"; // The name of the city in the cities collection

async function main() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("fenix");
    const counters = db.collection("counters");
    const parkingZones = db.collection("parking_zones");
    const cities = db.collection("cities");

    async function getNextParkingId() {
      const result = await counters.findOneAndUpdate(
        { _id: "parking_id" },
        { $inc: { seq: 1 } },
        { returnDocument: "after", upsert: true }
      );

      if (!result.value) {
        const newCounter = await counters.findOne({ _id: "parking_id" });
        return newCounter.seq;
      }

      return result.value.seq;
    }

    const parkingZonesData = JSON.parse(readFileSync(`./data/${city}_parking.json`, "utf8"));
    const cityDocument = await cities.findOne({ name: cityName });

    if (!cityDocument) {
      throw new Error(`City document for ${cityName} not found`);
    }

    const parkingZoneIds = [];

    for (const zone of parkingZonesData) {
      const nextId = await getNextParkingId();
      zone.parking_id = `P${nextId.toString().padStart(4, "0")}`;
      const result = await parkingZones.insertOne(zone);
      parkingZoneIds.push(result.insertedId);
    }

    await cities.updateOne(
      { _id: cityDocument._id },
      { $push: { parking_zones: { $each: parkingZoneIds } } }
    );

    console.log("Parking zones inserted and city document updated successfully.");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.close();
  }
}

main();