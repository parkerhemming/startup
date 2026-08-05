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

function cleanId(id) {
	return ObjectId.isValid(id) ? new ObjectId(id) : id;
}

function getUserById(id) {
	return collection.findOne({ _id: cleanId(id) });
}

function getUsersByIds(ids) {
	return collection.find({ _id: { $in: ids.filter(ObjectId.isValid).map((id) => new ObjectId(id)) } }).toArray();
}

async function addUser(user) {
	await collection.insertOne(user);
}

async function updateUser(user) {
	const { _id, ...updateData } = user;
	await collection.updateOne({ _id: cleanId(_id) }, { $set: updateData });
}

async function updateUserRemoveAuth(user) {
	await collection.updateOne({ email: user.email }, { $unset: { token: 1 } });
}

async function incrementField(token, field, increment) {
	await collection.updateMany({ token }, { $inc: { [field]: increment } });
}

async function getProfilesByGender(gender, currentUserEmail, limitCount) {
	return collection.find({ gender: { $regex: new RegExp(`^${gender}$`, "i") }, email: { $ne: currentUserEmail } }).sort({ "matches.length": 1 }).limit(parseInt(limitCount, 10) || 9).toArray();
}

function countProfiles(currentUserEmail) {
	return collection.countDocuments({ email: { $ne: currentUserEmail } });
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
	getUsersByIds,
	addUser,
	updateUser,
	updateUserRemoveAuth,
	incrementField,
	getProfilesByGender,
	countProfiles,
	addMatch,
	removeMatch,
};
