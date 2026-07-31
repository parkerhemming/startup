const express = require("express");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const uuid = require("uuid");
const app = express();
const DB = require("./database.js");

const port = process.argv.length > 2 ? process.argv[2] : 4000;
const apiRouter = express.Router();

app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));
app.use(`/api`, apiRouter);

apiRouter.post("/auth/login", async (req, res) => {
	try {
		const user = await findUser("email", req.body.email);

		if (user) {
			const { password, ...data } = user;
			if (await bcrypt.compare(req.body.password, password)) {
				user.token = uuid.v4();
				await DB.updateUser(user);
				setAuthCookie(res, user.token);
				return res.status(200).send(data);
			}
		}
		res.status(401).send({ msg: "Invalid email or password" });
	} catch (error) {
		console.error(error);
		res.status(500).send({ msg: "Server error" });
	}
});

apiRouter.delete("/auth/logout", async (req, res) => {
	try {
		const user = await findUser("token", req.cookies["token"]);
		if (user) {
			await DB.updateUserRemoveAuth(user);
		}
		res.clearCookie("token");
		res.status(204).end();
	} catch {
		res.sendStatus(500);
	}
});

apiRouter.post("/auth/signup", async (req, res) => {
	const {
		firstName,
		lastName,
		birthday,
		gender,
		email,
		password,
		bio,
		interests,
	} = req.body;

	if (
		!firstName ||
		!lastName ||
		!birthday ||
		!gender ||
		!email ||
		!password ||
		!bio ||
		!interests
	) {
		return res.status(400).send({ msg: "All fields are required" });
	}

	try {
		if (await findUser("email", req.body.email)) {
			res.status(409).send({ msg: "Existing user" });
		} else {
			const user = await createUser(req.body);

			const { token, password, ...data } = user;
			setAuthCookie(res, user.token);
			res.status(200).send(data);
		}
	} catch (error) {
		console.error(error);
		res.status(500).send({ msg: "Server error" });
	}
});

const verifyAuth = async (req, res, next) => {
	const user = await findUser("token", req.cookies["token"]);
	if (user) {
		req.user = user;
		next();
	} else {
		res.status(401).send({ msg: "Unauthorized" });
	}
};

apiRouter.put("/updateProfile", verifyAuth, async (req, res) => {
	try {
		const { firstName, lastName, bio, interests } = req.body;

		if (firstName !== undefined) req.user.firstName = firstName;
		if (lastName !== undefined) req.user.lastName = lastName;
		if (bio !== undefined) req.user.bio = bio;
		if (interests !== undefined) req.user.interests = interests;

		await DB.updateUser(req.user);

		const { password, ...user } = req.user;
		res.status(200).send(user);
	} catch (error) {
		console.error("Error updating profile:", error);
		res.status(500).send({ msg: "Server error updating profile" });
	}
});

apiRouter.post("/message", verifyAuth, async (req, res) => {
	const { matchId, message } = req.body;
	const myId = req.user._id.toString();
	const now = Date.now();

	try {
		const matchIndex = req.user.matches.findIndex((m) => m.id === matchId);
		if (matchIndex !== -1) {
			const match = req.user.matches[matchIndex];
			match.messages = match.messages || [];
			match.messages.push(message);
			match.text = message.text;
			match.time = message.time;
			match.timestamp = now;

			req.user.matches.splice(matchIndex, 1);
			req.user.matches.unshift(match);

			await DB.updateUser(req.user);
		}

		const recipient = await DB.getUserById(matchId);
		if (recipient) {
			const recMatchIndex = recipient.matches.findIndex(
				(m) => m.id === myId,
			);
			if (recMatchIndex !== -1) {
				const recMatch = recipient.matches[recMatchIndex];
				recMatch.messages = recMatch.messages || [];

				const recipientMessage = {
					...message,
					sender: req.user.firstName,
				};

				recMatch.messages.push(recipientMessage);
				recMatch.text = message.text;
				recMatch.time = message.time;
				recMatch.timestamp = now;

				recipient.matches.splice(recMatchIndex, 1);
				recipient.matches.unshift(recMatch);

				await DB.updateUser(recipient);
			}
		}

		const { password, ...user } = req.user;
		res.status(200).send(user);
	} catch (error) {
		console.error("Error sending message:", error);
		res.status(500).send({ msg: "Server error sending message" });
	}
});

apiRouter.post("/match/pair", verifyAuth, async (req, res) => {
	try {
		const { pairs } = req.body;
		const now = Date.now();

		for (const pair of pairs) {
			if (!pair || pair.length !== 2) continue;

			const userA = pair[0];
			const userB = pair[1];

			const idA = userA.id || userA._id;
			const idB = userB.id || userB._id;

			if (!idA || !idB) continue;

			const matchForA = {
				id: idB.toString(),
				firstName: userB.firstName,
				lastName: userB.lastName,
				gender: userB.gender,
				messages: [],
				text: "",
				time: "",
				timestamp: now,
			};

			const matchForB = {
				id: idA.toString(),
				firstName: userA.firstName,
				lastName: userA.lastName,
				gender: userA.gender,
				messages: [],
				text: "",
				time: "",
				timestamp: now,
			};

			await DB.addMatch(idA, matchForA);
			await DB.addMatch(idB, matchForB);
		}

		const updatedUser = await DB.getUserByToken(req.user.token);
		res.status(200).send(updatedUser);
	} catch (error) {
		console.error("Error pairing:", error);
		res.status(500).send({ msg: "Server error while pairing" });
	}
});

apiRouter.delete("/match/:id", verifyAuth, async (req, res) => {
	try {
		const matchId = req.params.id;
		const myId = req.user._id.toString();

		await DB.removeMatch(myId, matchId);
		await DB.removeMatch(matchId, myId);

		const updatedUser = await DB.getUserByToken(req.user.token);
		res.status(200).send(updatedUser);
	} catch (error) {
		console.error("Error unmatching:", error);
		res.status(500).send({ msg: "Server error while unmatching" });
	}
});

apiRouter.get("/getUser", verifyAuth, async (req, res) => {
	res.status(200).send(req.user);
});

apiRouter.post("/increment", verifyAuth, async (req, res) => {
	await DB.incrementField(req.user.token, req.body.field, req.body.increment);
	const user = await DB.getUserByToken(req.user.token);
	res.status(200).send(user);
});

apiRouter.get("/profiles", verifyAuth, async (req, res) => {
	try {
		const targetGender = req.query.gender || "Female";
		const limitCount = req.query.limit || 9;
		const profiles = await DB.getProfilesByGender(
			targetGender,
			req.user.email,
			limitCount,
		);

		const safeProfiles = profiles.map((profile) => {
			const { password, token, _id, ...safeData } = profile;
			return { id: _id.toString(), ...safeData };
		});

		res.status(200).send(safeProfiles);
	} catch (error) {
		console.error("Error fetching profiles:", error);
		res.status(500).send({ msg: "Server error fetching profiles" });
	}
});

apiRouter.get("/joke", verifyAuth, async (req, res) => {
	try {
		const response = await fetch(
			"https://official-joke-api.appspot.com/random_joke",
		);
		if (!response.ok) throw new Error("Failed to fetch from external API");
		const data = await response.json();
		res.json(data);
	} catch (error) {
		res.status(500).json({
			setup: "Could not load a joke right now.",
			punchline: "Server error!",
		});
	}
});

app.use(function (err, req, res, next) {
	res.status(500).send({ type: err.name, message: err.message });
});

app.use((_req, res) => {
	res.sendFile("index.html", { root: "public" });
});

async function findUser(field, value) {
	if (!value) return null;

	if (field === "token") {
		const result = DB.getUserByToken(value);
		return result;
	} else if (field === "email") {
		return DB.getUserByEmail(value);
	} else {
		throw "Field must be token or email.";
	}
}

async function createUser(data) {
	data.password = await bcrypt.hash(data.password, 10);

	const user = {
		...data,
		matches: [],
		notifications: [],
		coins: 0,
		boost: 0,
		token: uuid.v4(),
	};

	await DB.addUser(user);

	return user;
}

function setAuthCookie(res, authToken) {
	res.cookie("token", authToken, {
		maxAge: 1000 * 60 * 60 * 24 * 365,
		secure: true,
		httpOnly: true,
		sameSite: "strict",
	});
}

const httpService = app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
