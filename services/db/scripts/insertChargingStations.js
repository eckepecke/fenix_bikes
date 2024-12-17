import { config } from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import { readFileSync } from "fs";

config();

const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const uri = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.k5lbc.mongodb.net/fenix?retryWrites=true&w=majority&appName=Cluster0`;

const city = "skelleftea"; // The name of the city in the data file
const cityName = "Skelleftea"; // The name of the city in the cities collection

async function main() {
	const client = new MongoClient(uri);

	try {
		await client.connect();
		const db = client.db("fenix");
		const counters = db.collection("counters");
		const chargingStations = db.collection("charging_stations");
		const cities = db.collection("cities");

		async function getNextChargingId() {
			const result = await counters.findOneAndUpdate(
				{ _id: "charging_id" },
				{ $inc: { seq: 1 } },
				{ returnDocument: "after", upsert: true }
			);

			if (!result.value) {
				const newCounter = await counters.findOne({ _id: "charging_id" });
				return newCounter.seq;
			}

			return result.value.seq;
		}

		const chargingStationsData = JSON.parse(readFileSync(`./data/${city}_charging.json`, "utf8"));
		const cityDocument = await cities.findOne({ name: cityName });

		if (!cityDocument) {
			throw new Error(`City document for ${cityName} not found`);
		}

		const chargingStationIds = [];

		for (const station of chargingStationsData) {
			const nextId = await getNextChargingId();
			station.charging_id = `C${nextId.toString().padStart(4, "0")}`;
			station.plugs = [
				{ id: 1, available: true },
				{ id: 2, available: true },
				{ id: 3, available: true },
			];
			const result = await chargingStations.insertOne(station);
			chargingStationIds.push(result.insertedId);
		}

		await cities.updateOne(
			{ _id: cityDocument._id },
			{ $push: { charging_stations: { $each: chargingStationIds } } }
		);

		console.log("Charging stations inserted and city document updated successfully.");
	} catch (error) {
		console.error("Error:", error);
	} finally {
		await client.close();
	}
}

main();
