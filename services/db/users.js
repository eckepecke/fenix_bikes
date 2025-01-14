import { getCollection } from "./collections.js";
import { ObjectId } from "mongodb";

async function getNextUserId() {
	const counters = getCollection("counters");
	const result = await counters.findOneAndUpdate(
		{ _id: "user_id" },
		{ $inc: { seq: 1 } },
		{ returnDocument: "after", upsert: true }
	);

	return result.seq;
}

export const getUsers = async () => {
	const users = await getCollection("users").find().toArray();
	return users;
};

export const getUser = async (id) => {
	const _id = new ObjectId(id);
	const user = await getCollection("users").findOne({ _id });
	return user;
};

export const getUserByEmail = async (email) => {
	const user = await getCollection("users").findOne({ email: email });
	return user;
};

export const getUserByUserId = async (userId) => {
	const user = await getCollection("users").findOne({ user_id: userId });
	return user;
}

export const createUser = async (user) => {
	const userExists = await getUserByEmail(user.email);
	if (userExists) {
		throw new Error("User already exists");
	}

	let userIdSeq = await getNextUserId();
	let newUser = {
		...user,
		user_id: `U${userIdSeq.toString().padStart(4, "0")}`,
	};

	const result = await getCollection("users").insertOne(newUser);

	console.log(result);

	return result;
};

export const updateUser = async (user) => {
	const id = user.id;
	const result = await getCollection("users").updateOne({ id }, { $set: user });
	return result;
}

export const banUser = async (id) => {
	const _id = new ObjectId(id);
	const result = await getCollection("users").updateOne({ _id }, { $set: { banned: true } });
	return result;
};

export const unbanUser = async (id) => {
	const _id = new ObjectId(id);
	const result = await getCollection("users").updateOne({ _id }, { $set: { banned: false } });
	return result;
}

export const deleteUser = async (id) => {
	const _id = new ObjectId(id);
	const result = await getCollection("users").deleteOne({ _id });
	return result;
};

export const addToBalance = async (id, amount) => {
	const _id = new ObjectId(id);
	const result = await getCollection("users").updateOne({ _id }, { $inc: { balance: amount } });
	console.log("hej från addToBalance");
	return result;
}