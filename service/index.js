const express = require("express");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const uuid = require("uuid");
const app = express();

let users = [
	{
		firstName: "Parker",
		lastName: "Hemming",
		birthday: "2001-12-09",
		gender: "Male",
		email: "parker@hemm.ing",
		password:
			"$2b$10$lBUjhBngP4qs.Km6T/X1seUDQmv/2TluCCF4/xgpUKTyj11o4qSse",
		bio: "This is my bio!",
		interests: "Hiking, movies, gym",
		pfp1: {},
		pfp2: {},
		pfp3: {},
		pfp4: {},
		coins: 0,
		boost: 0,
	},
];

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

apiRouter.post("/auth/signup", async (req, res) => {
	try {
		if (await findUser("email", req.body.email)) {
			res.status(409).send({ msg: "Existing user" });
		} else {
			const user = await createUser(req.body);
			const { token, password, ...data } = user;

			setAuthCookie(res, token);
			res.status(200).send(data);
		}
	} catch (error) {
		console.error(error);
		res.status(500).send({ msg: "Server error" });
	}
});

apiRouter.delete("/auth/logout", async (req, res) => {
	try {
		const user = await findUser("token", req.cookies["token"]);
		if (user) {
			delete user.token;
		}
		res.clearCookie("token");
		res.status(204).end();
	} catch {
		res.sendStatus(500);
	}
});

apiRouter.get("/joke", async (req, res) => {
	try {
		const response = await fetch(
			"https://official-joke-api.appspot.com/random_joke",
		);
		if (!response.ok) throw new Error("Failed to fetch from external API");
		const data = await response.json();
		res.json(data);
	} catch (error) {
		console.error(error);
		res.status(500).json({
			setup: "Could not load a joke right now.",
			punchline: "Server error!",
		});
	}
});

function findUser(field, value) {
	if (!value) return null;
	return users.find((user) => user[field] === value);
}

async function createUser(data) {
	data.password = await bcrypt.hash(data.password, 10);

	const user = {
		...data,
		token: uuid.v4(),
	};

	users.push(user);

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
