const { MongoClient } = require("mongodb");
const { faker } = require("@faker-js/faker");
const bcrypt = require("bcryptjs");
const uuid = require("uuid");
const config = require("./dbConfig.json");

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db("startup");
const collection = db.collection("users");

const interestPool = [
	"Hiking",
	"Reading",
	"Cooking",
	"Photography",
	"Travel",
	"Movies",
	"Fitness",
	"Music",
	"Art",
	"Coffee",
	"Dogs",
	"Cats",
	"Gaming",
	"Yoga",
	"Dancing",
	"Surfing",
];

function getRandomInterests() {
	const shuffled = interestPool.sort(() => 0.5 - Math.random());
	return shuffled.slice(0, 3).join(", ");
}

async function generateUser(genderStr) {
	const genderFaker = genderStr === "Female" ? "female" : "male";
	const firstName = faker.person.firstName(genderFaker);
	const lastName = faker.person.lastName();

	const birthday = faker.date
		.birthdate({ min: 18, max: 35, mode: "age" })
		.toISOString()
		.split("T")[0];

	const email = faker.internet.email({ firstName, lastName }).toLowerCase();

	const password = await bcrypt.hash("password123", 10);

	const bio = faker.person.bio();
	const interests = getRandomInterests();

	const randomImageIndex = Math.floor(Math.random() * 100);
	const imageGender = genderStr === "Female" ? "women" : "men";
	const imageUrl = `https://randomuser.me/api/portraits/${imageGender}/${randomImageIndex}.jpg`;

	const profilePics = [imageUrl, imageUrl, imageUrl, imageUrl];

	return {
		firstName,
		lastName,
		birthday,
		gender: genderStr,
		email,
		password,
		bio,
		interests,
		profilePics,
		matches: [],
		notifications: [],
		coins: Math.floor(Math.random() * 50),
		boost: 0,
		activePairs: 0,
		token: uuid.v4(),
	};
}

async function seedDatabase() {
	try {
		console.log("Connecting to database...");
		await client.connect();
		console.log("Connected successfully.\n");

		console.log("Generating 15 Female users...");
		const females = [];
		for (let i = 0; i < 15; i++) {
			females.push(await generateUser("Female"));
		}

		console.log("Generating 15 Male users...");
		const males = [];
		for (let i = 0; i < 15; i++) {
			males.push(await generateUser("Male"));
		}

		const allUsers = [...females, ...males];

		console.log("Inserting 30 users into the database...");
		const result = await collection.insertMany(allUsers);

		console.log(`\n✅ Success! Seeded ${result.insertedCount} users.`);
		console.log(
			"Note: The password for ALL seeded accounts is: password123",
		);
	} catch (error) {
		console.error("Error seeding database:", error);
	} finally {
		await client.close();
		console.log("Database connection closed.");
	}
}

seedDatabase();
