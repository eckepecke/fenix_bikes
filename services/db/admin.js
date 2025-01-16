import { getCollection } from "./collections.js";
import { ObjectId } from "mongodb";


export const getAdmins = async () => {
  const admins = await getCollection("admins").find().toArray();
  return admins;
};

export const getAdmin = async (id) => {
  const _id = new ObjectId(id);
  const admin = await getCollection("admins").findOne({ _id });
  return admin;
};

export const getAdminByEmail = async (email) => {
  const admin = await getCollection("admins").findOne({ email: email });
  return admin;
};

export const createAdmin = async (admin) => {
  const adminExists = await getAdminByEmail(admin.email);
  if (adminExists) {
    throw new Error("Admin already exists");
  }

  const result = await getCollection("admins").insertOne(admin);
  return result;
}

export const updateAdmin = async (admin) => {
  const id = admin.id;
  const result = await getCollection("admins").updateOne({ id }, { $set: admin });
  return result;
}