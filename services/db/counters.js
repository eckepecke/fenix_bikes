import { getDatabase } from "./db.js";

export const getNextSequence = async (name) => {
  const db = getDatabase();
  const result = db.counters.findOneAndUpdate(
    { _id: name },
    { $inc: { seq: 1 } },
    { returnDocument: "after", upsert: true }
  );
  return result.value.seq;
}
