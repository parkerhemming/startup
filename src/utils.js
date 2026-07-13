export function toProperCase(str) {
	return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

export const maleUsers = [
	{
		id: "u_m1",
		email: "liam@proxy.com",
		password: "password123",
		coins: 33, // 50 base + 13 (matchmaker for pair 2) - 30 (bought 2 boosts)
		profile: {
			id: "p_m1",
			firstName: "Liam",
			lastName: "Smith",
			birthday: "2000-03-15",
			gender: "Male",
			bio: "Software engineer by day, amateur chef by night.",
			interests: ["Cooking", "Tech", "Hiking"],
			photos: ["/pfp-male.png"],
			boost: 12,
		}, // 12 views left
	},
	{
		id: "u_m2",
		email: "noah@proxy.com",
		password: "password123",
		coins: 35, // 50 base - 15 (bought 1 boost)
		profile: {
			id: "p_m2",
			firstName: "Noah",
			lastName: "Johnson",
			birthday: "1998-07-22",
			gender: "Male",
			bio: "Always down for a spontaneous road trip.",
			interests: ["Traveling", "Photography", "Coffee"],
			photos: ["/pfp-male.png"],
			boost: 4,
		},
	},
	{
		id: "u_m3",
		email: "oliver@proxy.com",
		password: "password123",
		coins: 61, // 50 base + 11 (matchmaker for pair 1: 5 for match, 6 msgs)
		profile: {
			id: "p_m3",
			firstName: "Oliver",
			lastName: "Williams",
			birthday: "1999-11-05",
			gender: "Male",
			bio: "Dog dad looking for a dog mom.",
			interests: ["Dogs", "Outdoors", "Live Music"],
			photos: ["/pfp-male.png"],
			boost: 0,
		},
	},
	{
		id: "u_m4",
		email: "elijah@proxy.com",
		password: "password123",
		coins: 51, // 50 base + 11 (matchmaker pair 1) - 10 (got unmatched in pair 4)
		profile: {
			id: "p_m4",
			firstName: "Elijah",
			lastName: "Brown",
			birthday: "2001-01-30",
			gender: "Male",
			bio: "Gym, eat, sleep, repeat.",
			interests: ["Working out", "Nutrition", "Sports"],
			photos: ["/pfp-male.png"],
			boost: 0,
		},
	},
	{
		id: "u_m5",
		email: "james@proxy.com",
		password: "password123",
		coins: 47, // 50 base - 3 (matchmaker for pair 4: +5 match, +2 msgs, -10 unmatch)
		profile: {
			id: "p_m5",
			firstName: "James",
			lastName: "Jones",
			birthday: "1997-09-12",
			gender: "Male",
			bio: "I probably like your Spotify playlist more than you do.",
			interests: ["Music", "Concerts", "Vinyl"],
			photos: ["/pfp-male.png"],
			boost: 0,
		},
	},
	{
		id: "u_m6",
		email: "william@proxy.com",
		password: "password123",
		coins: 65, // 50 base + 15 (matchmaker for pair 5: 5 match, 10 msgs)
		profile: {
			id: "p_m6",
			firstName: "William",
			lastName: "Garcia",
			birthday: "2002-04-18",
			gender: "Male",
			bio: "College student just trying to pass finals.",
			interests: ["Gaming", "Movies", "Pizza"],
			photos: ["/pfp-male.png"],
			boost: 0,
		},
	},
	{
		id: "u_m7",
		email: "ben@proxy.com",
		password: "password123",
		coins: 65, // 50 base + 15 (matchmaker for pair 5)
		profile: {
			id: "p_m7",
			firstName: "Ben",
			lastName: "Miller",
			birthday: "1995-12-08",
			gender: "Male",
			bio: "Let's go skiing this winter.",
			interests: ["Skiing", "Outdoors", "Craft Beer"],
			photos: ["/pfp-male.png"],
			boost: 0,
		},
	},
	{
		id: "u_m8",
		email: "lucas@proxy.com",
		password: "password123",
		coins: 55, // 50 base + 5 (matchmaker pair 6, 0 msgs)
		profile: {
			id: "p_m8",
			firstName: "Lucas",
			lastName: "Davis",
			birthday: "2000-08-25",
			gender: "Male",
			bio: "Ask me about my fantasy football team.",
			interests: ["Football", "Sports", "Beer"],
			photos: ["/pfp-male.png"],
			boost: 0,
		},
	},
	{
		id: "u_m9",
		email: "henry@proxy.com",
		password: "password123",
		coins: 50, // 50 base
		profile: {
			id: "p_m9",
			firstName: "Henry",
			lastName: "Rodriguez",
			birthday: "1999-02-14",
			gender: "Male",
			bio: "Just moved here, show me the best taco spots.",
			interests: ["Food", "Exploring", "Tacos"],
			photos: ["/pfp-male.png"],
			boost: 0,
		},
	},
	{
		id: "u_m10",
		email: "alex@proxy.com",
		password: "password123",
		coins: 50, // 50 base
		profile: {
			id: "p_m10",
			firstName: "Alex",
			lastName: "Martinez",
			birthday: "2001-06-20",
			gender: "Male",
			bio: "If we match, we have to play Mario Kart.",
			interests: ["Nintendo", "Board Games", "Fun"],
			photos: ["/pfp-male.png"],
			boost: 0,
		},
	},
	{
		id: "u_m11",
		email: "jackson@proxy.com",
		password: "password123",
		coins: 50, // 50 base
		profile: {
			id: "p_m11",
			firstName: "Jackson",
			lastName: "Hernandez",
			birthday: "1998-10-09",
			gender: "Male",
			bio: "Always finding a new hobby to hyperfixate on.",
			interests: ["Rock Climbing", "Reading", "Art"],
			photos: ["/pfp-male.png"],
			boost: 0,
		},
	},
	{
		id: "u_m12",
		email: "ryan@proxy.com",
		password: "password123",
		coins: 50, // 50 base
		profile: {
			id: "p_m12",
			firstName: "Ryan",
			lastName: "Lopez",
			birthday: "1996-05-02",
			gender: "Male",
			bio: "Looking for someone to go to concerts with.",
			interests: ["Live Music", "Festivals", "EDM"],
			photos: ["/pfp-male.png"],
			boost: 0,
		},
	},
];

export const femaleUsers = [
	{
		id: "u_f1",
		email: "emma@proxy.com",
		password: "password123",
		coins: 35, // 50 base - 15 (bought 1 boost)
		profile: {
			id: "p_f1",
			firstName: "Emma",
			lastName: "Gonzalez",
			birthday: "2000-01-12",
			gender: "Female",
			bio: "I will definitely swipe right if you have a dog.",
			interests: ["Dogs", "Coffee", "Thrifting"],
			photos: ["/pfp-female.png"],
			boost: 8,
		},
	},
	{
		id: "u_f2",
		email: "mia@proxy.com",
		password: "password123",
		coins: 61, // 50 base + 11 (matchmaker pair 1)
		profile: {
			id: "p_f2",
			firstName: "Mia",
			lastName: "Wilson",
			birthday: "2001-09-04",
			gender: "Female",
			bio: "Matchmaker extraordinaire.",
			interests: ["Matchmaking", "Fashion", "Baking"],
			photos: ["/pfp-female.png"],
			boost: 0,
		},
	},
	{
		id: "u_f3",
		email: "sophia@proxy.com",
		password: "password123",
		coins: 63, // 50 base + 13 (matchmaker pair 2)
		profile: {
			id: "p_f3",
			firstName: "Sophia",
			lastName: "Anderson",
			birthday: "1999-12-18",
			gender: "Female",
			bio: "Looking for someone to try new restaurants with.",
			interests: ["Foodie", "Wine", "Travel"],
			photos: ["/pfp-female.png"],
			boost: 0,
		},
	},
	{
		id: "u_f4",
		email: "isabella@proxy.com",
		password: "password123",
		coins: 45, // 50 base - 10 (got unmatched in pair 4) + 5 (matchmaker pair 6)
		profile: {
			id: "p_f4",
			firstName: "Isabella",
			lastName: "Thomas",
			birthday: "1998-03-27",
			gender: "Female",
			bio: "Tell me your best pickup line.",
			interests: ["Comedy", "Movies", "Sarcasm"],
			photos: ["/pfp-female.png"],
			boost: 0,
		},
	},
	{
		id: "u_f5",
		email: "ava@proxy.com",
		password: "password123",
		coins: 47, // 50 base - 3 (matchmaker for pair 4)
		profile: {
			id: "p_f5",
			firstName: "Ava",
			lastName: "Taylor",
			birthday: "2002-06-14",
			gender: "Female",
			bio: "If you don't like sushi we can't be friends.",
			interests: ["Sushi", "Beaches", "Summer"],
			photos: ["/pfp-female.png"],
			boost: 0,
		},
	},
	{
		id: "u_f6",
		email: "charlotte@proxy.com",
		password: "password123",
		coins: 65, // 50 base + 15 (matchmaker pair 5)
		profile: {
			id: "p_f6",
			firstName: "Charlotte",
			lastName: "Moore",
			birthday: "1997-11-21",
			gender: "Female",
			bio: "Let's grab a drink and see what happens.",
			interests: ["Cocktails", "Nightlife", "Dancing"],
			photos: ["/pfp-female.png"],
			boost: 0,
		},
	},
	{
		id: "u_f7",
		email: "amelia@proxy.com",
		password: "password123",
		coins: 65, // 50 base + 15 (matchmaker pair 5)
		profile: {
			id: "p_f7",
			firstName: "Amelia",
			lastName: "Jackson",
			birthday: "2000-02-08",
			gender: "Female",
			bio: "Looking for a gym partner.",
			interests: ["Fitness", "Lifting", "Health"],
			photos: ["/pfp-female.png"],
			boost: 0,
		},
	},
	{
		id: "u_f8",
		email: "harper@proxy.com",
		password: "password123",
		coins: 50, // 50 base
		profile: {
			id: "p_f8",
			firstName: "Harper",
			lastName: "Martin",
			birthday: "1999-05-19",
			gender: "Female",
			bio: "Just seeing what this is all about.",
			interests: ["Reading", "Coffee", "Rain"],
			photos: ["/pfp-female.png"],
			boost: 0,
		},
	},
];

export const mockUsers = [...maleUsers, ...femaleUsers];

export const mockPairs = [
	{
		id: "pair_1",
		profile1Id: "p_m1", // Liam
		profile2Id: "p_f1", // Emma
		consensus: ["u_m3", "u_f2", "u_m4"], // 3 matchmakers
		status: "Matched",
	},
	{
		id: "pair_2",
		profile1Id: "p_m2", // Noah
		profile2Id: "p_f2", // Mia
		consensus: ["u_m1", "u_f3"], // 2 matchmakers
		status: "Matched",
	},
	{
		id: "pair_3",
		profile1Id: "p_m3", // Oliver
		profile2Id: "p_f3", // Sophia
		consensus: ["u_f1"], // Only 1 matchmaker, hasn't hit threshold yet
		status: "Pending",
	},
	{
		id: "pair_4",
		profile1Id: "p_m4", // Elijah
		profile2Id: "p_f4", // Isabella
		consensus: ["u_m5", "u_f5"], // 2 matchmakers, but it went bad
		status: "Unmatched",
	},
	{
		id: "pair_5",
		profile1Id: "p_m5", // James
		profile2Id: "p_f5", // Ava
		consensus: ["u_m6", "u_m7", "u_f6", "u_f7"], // 4 matchmakers! Strong consensus.
		status: "Matched",
	},
	{
		id: "pair_6",
		profile1Id: "p_m6", // William
		profile2Id: "p_f8", // Harper
		consensus: ["u_m8", "u_f4"], // 2 matchmakers
		status: "Matched",
	},
	{
		id: "pair_7",
		profile1Id: "p_m7", // Ben
		profile2Id: "p_f2", // Mia (Can be paired with multiple people while pending)
		consensus: ["u_m9"],
		status: "Pending",
	},
];

export const mockMessages = [
	// --- Pair 1: Liam & Emma (6 messages) ---
	{
		id: "msg_1",
		pairId: "pair_1",
		senderId: "p_m1",
		text: "Hey Emma! Looks like 3 people thought we'd get along.",
		sentAt: "2026-07-13T10:00:00Z",
	},
	{
		id: "msg_2",
		pairId: "pair_1",
		senderId: "p_f1",
		text: "Haha they must have seen my bio about dogs and your photo with the golden retriever.",
		sentAt: "2026-07-13T10:05:00Z",
	},
	{
		id: "msg_3",
		pairId: "pair_1",
		senderId: "p_m1",
		text: "Guilty as charged. That's Buster. He's a good boy.",
		sentAt: "2026-07-13T10:12:00Z",
	},
	{
		id: "msg_4",
		pairId: "pair_1",
		senderId: "p_f1",
		text: "Omg I love him already. We definitely need to go to a dog park sometime.",
		sentAt: "2026-07-13T10:20:00Z",
	},
	{
		id: "msg_5",
		pairId: "pair_1",
		senderId: "p_m1",
		text: "I'd love that. Are you free this weekend?",
		sentAt: "2026-07-13T10:45:00Z",
	},
	{
		id: "msg_6",
		pairId: "pair_1",
		senderId: "p_f1",
		text: "Saturday morning works for me! 🐶",
		sentAt: "2026-07-13T11:00:00Z",
	},

	// --- Pair 2: Noah & Mia (8 messages) ---
	{
		id: "msg_7",
		pairId: "pair_2",
		senderId: "p_f2",
		text: "Hey Noah! The consensus has spoken.",
		sentAt: "2026-07-12T15:00:00Z",
	},
	{
		id: "msg_8",
		pairId: "pair_2",
		senderId: "p_m2",
		text: "Hey Mia! Glad they put us together. How's your week going?",
		sentAt: "2026-07-12T15:30:00Z",
	},
	{
		id: "msg_9",
		pairId: "pair_2",
		senderId: "p_f2",
		text: "Pretty good, just working and trying to stay out of the heat.",
		sentAt: "2026-07-12T15:45:00Z",
	},
	{
		id: "msg_10",
		pairId: "pair_2",
		senderId: "p_m2",
		text: "I feel that. I'm actually planning a road trip up to the mountains this weekend to escape it.",
		sentAt: "2026-07-12T16:00:00Z",
	},
	{
		id: "msg_11",
		pairId: "pair_2",
		senderId: "p_f2",
		text: "That sounds amazing. I love the mountains.",
		sentAt: "2026-07-12T16:15:00Z",
	},
	{
		id: "msg_12",
		pairId: "pair_2",
		senderId: "p_m2",
		text: "You should come! Totally spontaneous, I know.",
		sentAt: "2026-07-12T16:30:00Z",
	},
	{
		id: "msg_13",
		pairId: "pair_2",
		senderId: "p_f2",
		text: "Haha maybe I will. Buy me a coffee first and we'll see.",
		sentAt: "2026-07-12T17:00:00Z",
	},
	{
		id: "msg_14",
		pairId: "pair_2",
		senderId: "p_m2",
		text: "Deal. Tomorrow at 10?",
		sentAt: "2026-07-12T17:15:00Z",
	},

	// --- Pair 4: Elijah & Isabella (Unmatched - 2 messages) ---
	{
		id: "msg_15",
		pairId: "pair_4",
		senderId: "p_m4",
		text: "Hey.",
		sentAt: "2026-07-11T09:00:00Z",
	},
	{
		id: "msg_16",
		pairId: "pair_4",
		senderId: "p_f4",
		text: "That's not a very good pickup line.",
		sentAt: "2026-07-11T09:30:00Z",
	},
	// *Unmatched shortly after*

	// --- Pair 5: James & Ava (10 messages) ---
	{
		id: "msg_17",
		pairId: "pair_5",
		senderId: "p_m5",
		text: "Okay, let's settle this. Best sushi spot in town?",
		sentAt: "2026-07-13T12:00:00Z",
	},
	{
		id: "msg_18",
		pairId: "pair_5",
		senderId: "p_f5",
		text: "Oh you're coming right out of the gate with the hard questions. It's definitely Sakura on 4th.",
		sentAt: "2026-07-13T12:05:00Z",
	},
	{
		id: "msg_19",
		pairId: "pair_5",
		senderId: "p_m5",
		text: "Wow. Respectfully, you are entirely wrong. It's Ocean Blue.",
		sentAt: "2026-07-13T12:10:00Z",
	},
	{
		id: "msg_20",
		pairId: "pair_5",
		senderId: "p_f5",
		text: "Ocean Blue is so overrated! You're paying for the aesthetics, not the fish.",
		sentAt: "2026-07-13T12:15:00Z",
	},
	{
		id: "msg_21",
		pairId: "pair_5",
		senderId: "p_m5",
		text: "Okay, maybe you have a point there. But their spicy tuna crispy rice is unbeatable.",
		sentAt: "2026-07-13T12:20:00Z",
	},
	{
		id: "msg_22",
		pairId: "pair_5",
		senderId: "p_f5",
		text: "Fine, I'll give you that one. It is pretty good.",
		sentAt: "2026-07-13T12:25:00Z",
	},
	{
		id: "msg_23",
		pairId: "pair_5",
		senderId: "p_m5",
		text: "See? We can agree on things.",
		sentAt: "2026-07-13T12:30:00Z",
	},
	{
		id: "msg_24",
		pairId: "pair_5",
		senderId: "p_f5",
		text: " Barely. 😂",
		sentAt: "2026-07-13T12:35:00Z",
	},
	{
		id: "msg_25",
		pairId: "pair_5",
		senderId: "p_m5",
		text: "I'll prove Sakura is worse. Let's go this Thursday.",
		sentAt: "2026-07-13T12:40:00Z",
	},
	{
		id: "msg_26",
		pairId: "pair_5",
		senderId: "p_f5",
		text: "You're on. Prepare to be proven wrong.",
		sentAt: "2026-07-13T12:45:00Z",
	},

	// Pair 6 matched but hasn't messaged yet!
];
