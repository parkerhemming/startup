const express = require("express");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const uuid = require("uuid");
const app = express();
const DB = require("./database.js");
const multer = require("multer");
const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { s3Client } = require("./s3-config.js");
const sharp = require("sharp");
const { peerProxy, notifyUser } = require("./peerProxy.js");

const port = process.argv.length > 2 ? process.argv[2] : 4000;
const apiRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));
app.use(`/api`, apiRouter);

apiRouter.post("/auth/login", async (req, res) => {
	try {
		const user = await findUser("email", req.body.email);

		if (user) {
			if (await bcrypt.compare(req.body.password, user.password)) {
				user.token = uuid.v4();

				await DB.updateUser(user);
				setAuthCookie(res, user.token);

				const populatedUser = await populateUserMatches(user);
				const { password, ...safeUser } = populatedUser;

				return res.status(200).send(safeUser);
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

apiRouter.post(
	"/auth/signup",
	upload.array("profilePics", 4),
	async (req, res) => {
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

		if (!req.files || req.files.length !== 4) {
			return res
				.status(400)
				.send({ msg: "Exactly 4 profile pictures are required." });
		}

		try {
			if (await findUser("email", email)) {
				return res.status(409).send({ msg: "Existing user" });
			}

			const bucketName = "proxy-dating";
			let uploadedImageUrls = [];

			const uploadPromises = req.files.map(async (file) => {
				const optimizedBuffer = await sharp(file.buffer)
					.rotate()
					.resize({ width: 600, height: 800, fit: "cover" })
					.webp({ quality: 80 })
					.toBuffer();

				const uniqueName =
					uuid.v4() +
					"-" +
					file.originalname.split(".")[0].replace(/\s+/g, "-");
				const key = `profile-pictures/${uniqueName}.webp`;
				await s3Client.send(
					new PutObjectCommand({
						Bucket: bucketName,
						Key: key,
						Body: optimizedBuffer,
						ContentType: "image/webp",
					}),
				);

				return `https://${bucketName}.s3.amazonaws.com/${key}`;
			});

			uploadedImageUrls = await Promise.all(uploadPromises);

			const user = await createUser({
				...req.body,
				profilePics: uploadedImageUrls,
			});

			setAuthCookie(res, user.token);

			const populatedUser = await populateUserMatches(user);
			const { password: pwd, ...safeUser } = populatedUser;

			res.status(200).send(safeUser);
		} catch (error) {
			console.error(error);
			res.status(500).send({ msg: "Server error" });
		}
	},
);

const verifyAuth = async (req, res, next) => {
	const user = await findUser("token", req.cookies["token"]);
	if (user) {
		req.user = user;
		next();
	} else {
		res.status(401).send({ msg: "Unauthorized" });
	}
};

apiRouter.put(
	"/updateProfile",
	verifyAuth,
	upload.fields([
		{ name: "pic_0", maxCount: 1 },
		{ name: "pic_1", maxCount: 1 },
		{ name: "pic_2", maxCount: 1 },
		{ name: "pic_3", maxCount: 1 },
	]),
	async (req, res) => {
		try {
			const { firstName, lastName, bio, interests, birthday } = req.body;

			if (firstName !== undefined) req.user.firstName = firstName;
			if (lastName !== undefined) req.user.lastName = lastName;
			if (bio !== undefined) req.user.bio = bio;
			if (interests !== undefined) req.user.interests = interests;
			if (birthday !== undefined) req.user.birthday = birthday;

			let updatedPics = [...(req.user.profilePics || [])];
			const bucketName = "proxy-dating";

			for (let i = 0; i < 4; i++) {
				const fieldName = `pic_${i}`;
				if (req.files && req.files[fieldName]) {
					const file = req.files[fieldName][0];

					if (updatedPics[i]) {
						await deleteFromS3(updatedPics[i]);
					}

					const optimizedBuffer = await sharp(file.buffer)
						.rotate()
						.resize({ width: 600, height: 800, fit: "cover" })
						.webp({ quality: 80 })
						.toBuffer();

					const uniqueName =
						uuid.v4() +
						"-" +
						file.originalname.split(".")[0].replace(/\s+/g, "-");
					const key = `profile-pictures/${uniqueName}.webp`;

					await s3Client.send(
						new PutObjectCommand({
							Bucket: bucketName,
							Key: key,
							Body: optimizedBuffer,
							ContentType: "image/webp",
						}),
					);

					updatedPics[i] =
						`https://${bucketName}.s3.amazonaws.com/${key}`;
				}
			}

			req.user.profilePics = updatedPics;
			await DB.updateUser(req.user);

			const populatedUser = await populateUserMatches(req.user);
			const { password, ...safeUser } = populatedUser;
			res.status(200).send(safeUser);
		} catch (error) {
			console.error("Error updating profile:", error);
			res.status(500).send({ msg: "Server error updating profile" });
		}
	},
);

apiRouter.post("/message", verifyAuth, async (req, res) => {
	const { matchId, message } = req.body;
	const myId = req.user._id.toString();
	const now = Date.now();

	try {
		let activeMatchmakers = [];

		const matchIndex = req.user.matches.findIndex((m) => m.id === matchId);
		if (matchIndex !== -1) {
			const match = req.user.matches[matchIndex];

			activeMatchmakers =
				match.matchmakers || (match.pairedBy ? [match.pairedBy] : []);

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
				notifyUser(matchId, "NEW_MESSAGE", {
					matchId: myId,
					message: recipientMessage,
					text: message.text,
					time: message.time,
					timestamp: now,
				});
			}
		}

		for (const mmId of activeMatchmakers) {
			const matchmaker = await DB.getUserById(mmId);
			if (matchmaker) {
				matchmaker.coins = (matchmaker.coins || 0) + 1;
				await DB.updateUser(matchmaker);

				notifyUser(mmId, "COIN_UPDATE", {
					coins: matchmaker.coins,
				});
			}
		}

		const populatedUser = await populateUserMatches(req.user);
		const { password, ...safeUser } = populatedUser;
		res.status(200).send(safeUser);
	} catch (error) {
		console.error("Error sending message:", error);
		res.status(500).send({ msg: "Server error sending message" });
	}
});

apiRouter.post("/match/pair", verifyAuth, async (req, res) => {
	try {
		const { pairs } = req.body;
		const now = Date.now();
		const matchmaker = req.user;
		const matchmakerId = matchmaker._id.toString();
		const timeStr = new Date().toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
		});

		let proxyPairsCreated = 0;
		let matchMeCreated = 0;

		for (const pair of pairs) {
			if (!pair || pair.length !== 2) continue;

			const reqA = pair[0];
			const reqB = pair[1];

			const idA = reqA.id || reqA._id;
			const idB = reqB.id || reqB._id;

			if (!idA || !idB) continue;

			const isMatchMe =
				idA.toString() === matchmakerId ||
				idB.toString() === matchmakerId;

			const userA = await DB.getUserById(idA);
			const userB = await DB.getUserById(idB);

			if (!userA || !userB) continue;

			userA.notifications = userA.notifications || [];
			userB.notifications = userB.notifications || [];
			userA.matches = userA.matches || [];
			userB.matches = userB.matches || [];

			const aMatchIndex = userA.matches.findIndex(
				(m) => m.id === idB.toString(),
			);
			const bMatchIndex = userB.matches.findIndex(
				(m) => m.id === idA.toString(),
			);

			if (aMatchIndex !== -1 && bMatchIndex !== -1) {
				if (!isMatchMe) {
					const aMatch = userA.matches[aMatchIndex];
					const bMatch = userB.matches[bMatchIndex];

					aMatch.matchmakers =
						aMatch.matchmakers ||
						(aMatch.pairedBy ? [aMatch.pairedBy] : []);
					bMatch.matchmakers =
						bMatch.matchmakers ||
						(bMatch.pairedBy ? [bMatch.pairedBy] : []);

					if (!aMatch.matchmakers.includes(matchmakerId)) {
						aMatch.matchmakers.push(matchmakerId);
						bMatch.matchmakers.push(matchmakerId);

						userA.notifications.unshift({
							id: uuid.v4(),
							text: `${matchmaker.firstName} thinks you and ${userB.firstName} are a good match too!`,
							icon: "fa-heart",
							time: timeStr,
						});
						userB.notifications.unshift({
							id: uuid.v4(),
							text: `${matchmaker.firstName} thinks you and ${userA.firstName} are a good match too!`,
							icon: "fa-heart",
							time: timeStr,
						});

						proxyPairsCreated++;
						await DB.updateUser(userA);
						await DB.updateUser(userB);

						notifyUser(idA.toString(), "SYNC_USER", {});
						notifyUser(idB.toString(), "SYNC_USER", {});
					}
				} else {
					matchMeCreated++;

					if (idA.toString() === matchmakerId) {
						userB.notifications.unshift({
							id: uuid.v4(),
							text: `${userA.firstName} used Match Me on you! Message them!`,
							link: "/message",
							state: { id: idA.toString() },
							icon: "fa-heart",
							time: timeStr,
						});
					} else if (idB.toString() === matchmakerId) {
						userA.notifications.unshift({
							id: uuid.v4(),
							text: `${userB.firstName} used Match Me on you! Message them!`,
							link: "/message",
							state: { id: idB.toString() },
							icon: "fa-heart",
							time: timeStr,
						});
					}

					await DB.updateUser(userA);
					await DB.updateUser(userB);

					notifyUser(idA.toString(), "SYNC_USER", {});
					notifyUser(idB.toString(), "SYNC_USER", {});
				}
			} else {
				const matchmakersArr = isMatchMe ? [] : [matchmakerId];

				userA.matches.unshift({
					id: idB.toString(),
					matchmakers: matchmakersArr,
					messages: [],
					text: "",
					time: "",
					timestamp: now,
				});

				userB.matches.unshift({
					id: idA.toString(),
					matchmakers: matchmakersArr,
					messages: [],
					text: "",
					time: "",
					timestamp: now,
				});

				if (!isMatchMe) {
					userA.notifications.unshift({
						id: uuid.v4(),
						text: `${matchmaker.firstName} paired you with ${userB.firstName}, message them!`,
						link: "/message",
						state: { id: idB.toString() },
						icon: "fa-comment",
						time: timeStr,
					});

					userB.notifications.unshift({
						id: uuid.v4(),
						text: `${matchmaker.firstName} paired you with ${userA.firstName}, message them!`,
						link: "/message",
						state: { id: idA.toString() },
						icon: "fa-comment",
						time: timeStr,
					});

					proxyPairsCreated++;
				} else {
					matchMeCreated++;
					if (idA.toString() === matchmakerId) {
						userB.notifications.unshift({
							id: uuid.v4(),
							text: `${userA.firstName} matched directly with you! Message them!`,
							link: "/message",
							state: { id: idA.toString() },
							icon: "fa-heart",
							time: timeStr,
						});
					} else if (idB.toString() === matchmakerId) {
						userA.notifications.unshift({
							id: uuid.v4(),
							text: `${userB.firstName} matched directly with you! Message them!`,
							link: "/message",
							state: { id: idB.toString() },
							icon: "fa-heart",
							time: timeStr,
						});
					}
				}

				await DB.updateUser(userA);
				await DB.updateUser(userB);

				notifyUser(idA.toString(), "SYNC_USER", {});
				notifyUser(idB.toString(), "SYNC_USER", {});
			}
		}

		if (proxyPairsCreated > 0 || matchMeCreated > 0) {
			const freshUser = await DB.getUserById(matchmakerId);

			if (proxyPairsCreated > 0) {
				freshUser.coins =
					(freshUser.coins || 0) + proxyPairsCreated * 5;
				freshUser.activePairs =
					(freshUser.activePairs || 0) + proxyPairsCreated;
			}

			if (matchMeCreated > 0) {
				freshUser.coins = (freshUser.coins || 0) - matchMeCreated * 30;
			}

			await DB.updateUser(freshUser);
		}

		const updatedUser = await DB.getUserByToken(req.user.token);
		const populatedUser = await populateUserMatches(updatedUser);
		const { password, ...safeUser } = populatedUser;

		res.status(200).send(safeUser);
	} catch (error) {
		console.error("Error pairing:", error);
		res.status(500).send({ msg: "Server error while pairing" });
	}
});

apiRouter.delete("/match/:matchId", verifyAuth, async (req, res) => {
	try {
		const matchId = req.params.matchId;
		const userId = req.user.id || req.user._id;
		const match = req.user.matches?.find((m) => m.id === matchId);
		const matchmakersSet = new Set(match?.matchmakers || []);
		const otherUserId = match ? match.id : null;

		req.user.matches = req.user.matches.filter((m) => m.id !== matchId);
		await DB.updateUser(req.user);
		if (otherUserId) {
			const otherUser = await DB.getUserById(otherUserId);
			if (otherUser && otherUser.matches) {
				const otherMatch = otherUser.matches.find(
					(m) => m.id === userId.toString(),
				);
				if (otherMatch?.matchmakers) {
					otherMatch.matchmakers.forEach((mm) =>
						matchmakersSet.add(mm),
					);
				}

				otherUser.matches = otherUser.matches.filter(
					(m) => m.id !== userId.toString(),
				);
				await DB.updateUser(otherUser);

				notifyUser(otherUserId.toString(), "SYNC_USER", {});
			}
		}

		const timeStr = new Date().toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
		});

		for (const mmId of matchmakersSet) {
			const mm = await DB.getUserById(mmId);
			if (mm) {
				mm.coins = (mm.coins || 0) - 10;
				mm.activePairs = Math.max(0, (mm.activePairs || 0) - 1);

				const newNotif = {
					id: uuid.v4(),
					text: `Ouch! A couple you paired unmatched. You lost 10 coins and an active pair!`,
					icon: "fa-heart-crack",
					time: timeStr,
				};

				mm.notifications = mm.notifications || [];
				mm.notifications.unshift(newNotif);

				await DB.updateUser(mm);
				notifyUser(mmId.toString(), "COIN_UPDATE", {
					coins: mm.coins,
					activePairs: mm.activePairs,
					newNotification: newNotif,
				});
			}
		}

		const populatedUser = await populateUserMatches(req.user);
		const { password, ...safeUser } = populatedUser;

		res.status(200).send(safeUser);
	} catch (error) {
		console.error("Error deleting match:", error);
		res.status(500).send({ msg: "Server error while unmatching" });
	}
});

apiRouter.get("/getUser", verifyAuth, async (req, res) => {
	const populatedUser = await populateUserMatches(req.user);
	const { password, ...safeUser } = populatedUser;
	res.status(200).send(safeUser);
});

apiRouter.post("/increment", verifyAuth, async (req, res) => {
	await DB.incrementField(req.user.token, req.body.field, req.body.increment);

	const user = await DB.getUserByToken(req.user.token);
	const populatedUser = await populateUserMatches(user);
	const { password, ...safeUser } = populatedUser;

	res.status(200).send(safeUser);
});

apiRouter.get("/profiles", verifyAuth, async (req, res) => {
	try {
		const targetGender = req.query.gender || "Female";
		const limitCount = parseInt(req.query.limit, 10) || 9;

		let profiles = await DB.getProfilesByGender(
			targetGender,
			req.user.email,
			100,
		);

		profiles = profiles.sort(() => 0.5 - Math.random());
		profiles.sort(
			(a, b) => (a.matches?.length || 0) - (b.matches?.length || 0),
		);

		const selectedProfiles = profiles.slice(0, limitCount);

		const safeProfiles = selectedProfiles.map((profile) => {
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
		activePairs: 0,
		token: uuid.v4(),
	};

	await DB.addUser(user);

	return user;
}

function setAuthCookie(res, authToken) {
	res.cookie("token", authToken, {
		maxAge: 1000 * 60 * 60 * 24 * 365,
		secure: false,
		httpOnly: true,
		sameSite: "strict",
	});
}

apiRouter.delete("/notifications", verifyAuth, async (req, res) => {
	try {
		req.user.notifications = [];
		await DB.updateUser(req.user);

		const populatedUser = await populateUserMatches(req.user);
		const { password, ...safeUser } = populatedUser;

		res.status(200).send(safeUser);
	} catch (error) {
		console.error("Error clearing notifications:", error);
		res.status(500).send({
			msg: "Server error while clearing notifications",
		});
	}
});

async function populateUserMatches(user) {
	if (!user || !user.matches) return user;

	const populatedMatches = await Promise.all(
		user.matches.map(async (match) => {
			const matchUser = await DB.getUserById(match.id);

			if (matchUser) {
				return {
					...match,
					firstName: matchUser.firstName,
					lastName: matchUser.lastName,
					gender: matchUser.gender,
					bio: matchUser.bio,
					interests: matchUser.interests,
					profilePics: matchUser.profilePics || [],
				};
			} else {
				return {
					...match,
					firstName: "Deleted User",
					lastName: "",
					gender: "Other",
					bio: "This account no longer exists.",
					interests: "",
					profilePics: [],
				};
			}
		}),
	);

	return { ...user, matches: populatedMatches };
}

async function deleteFromS3(url) {
	if (!url || !url.includes("amazonaws.com")) return;
	try {
		const key = decodeURIComponent(url.split(".amazonaws.com/")[1]);
		if (key) {
			await s3Client.send(
				new DeleteObjectCommand({
					Bucket: "proxy-dating",
					Key: key,
				}),
			);
		}
	} catch (err) {
		console.error("Failed to delete old image from S3:", err);
	}
}

const httpService = app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});

peerProxy(httpService);
