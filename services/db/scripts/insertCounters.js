
const DB_USER = "scooter";
const DB_PASS = "8g9xCnfVSVgiEVm";
const uri = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.k5lbc.mongodb.net/fenix?retryWrites=true&w=majority&appName=Cluster0`;
import { MongoClient } from "mongodb";

const client = await MongoClient.connect(uri, {
});

const db = client.db("fenix");

const counters = db.collection("counters");

// Change to the id that you want to insert
const id = "charging_id";

// Insert the id counter
await counters.insertOne({
  _id: `${id}`,
  seq: 0,
});

// Find the inserted document
const result = await counters.findOne({ _id: `${id}`, });
console.log("Inserted document:", result);

// Close the connection
await client.close();
