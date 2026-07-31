const { MongoClient, ObjectId } = require("mongodb");
const config = require("./dbConfig.json");

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db("startup");
const collection = db.collection("users");

(async function testConnection() {
	try {
		await db.command({ ping: 1 });
		console.log(`Connect to database`);
	} catch (ex) {
		console.log(
			`Unable to connect to database with ${url} because ${ex.message}`,
		);
		process.exit(1);
	}
})();

function getUserByEmail(email) {
	return collection.findOne({ email: email });
}

function getUserByToken(token) {
	return collection.findOne({ token: token });
}

function getUserById(id) {
	let queryId;
	try {
		queryId = new ObjectId(id);
	} catch (e) {
		queryId = id;
	}
	return collection.findOne({ _id: queryId });
}

async function addUser(user) {
	await collection.insertOne(user);
}

async function updateUser(user) {
	const { _id, ...updateData } = user;
	await collection.updateOne({ email: user.email }, { $set: updateData });
}

async function updateUserRemoveAuth(user) {
	await collection.updateOne({ email: user.email }, { $unset: { token: 1 } });
}

async function incrementField(token, field, increment) {
	await collection.updateMany({ token }, { $inc: { [field]: increment } });
}

async function getProfilesByGender(gender, currentUserEmail, limitCount) {
	const limit = parseInt(limitCount, 10) || 9;
	const cursor = collection
		.find({
			gender: { $regex: new RegExp(`^${gender}$`, "i") },
			email: { $ne: currentUserEmail },
		})
		.limit(limit);

	return cursor.toArray();
}

async function addMatch(userId, matchObj) {
	let queryId;
	try {
		queryId = new ObjectId(userId);
	} catch (e) {
		queryId = userId;
	}

	const user = await collection.findOne({ _id: queryId });
	if (user) {
		const alreadyMatched = user.matches?.some((m) => m.id === matchObj.id);
		if (!alreadyMatched) {
			await collection.updateOne(
				{ _id: queryId },
				{ $push: { matches: { $each: [matchObj], $position: 0 } } },
			);
		}
	}
}

async function removeMatch(userId, matchId) {
	let queryId;
	try {
		queryId = new ObjectId(userId);
	} catch (e) {
		queryId = userId;
	}
	await collection.updateOne(
		{ _id: queryId },
		{ $pull: { matches: { id: matchId } } },
	);
}

module.exports = {
	getUserByEmail,
	getUserByToken,
	getUserById,
	addUser,
	updateUser,
	updateUserRemoveAuth,
	incrementField,
	getProfilesByGender,
	addMatch,
	removeMatch,
};
