const express = require("express");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const uuid = require("uuid");
const app = express();

const fakeFemaleMatches = [
	{
		id: 1,
		firstName: "Sarah",
		lastName: "Adams",
		birthday: "1993-02-14",
		gender: "Female",
		bio: "Coffee lover and weekend hiker.",
		interests: "Hiking, Coffee, Reading",
		pfp1: {},
		time: "1:00 PM",
		text: "Hey! How's your week going so far?",
		messages: [
			{
				sender: "Me",
				text: "Hey Sarah! Love your hiking pics.",
				time: "12:30 PM",
			},
			{
				sender: "Sarah",
				text: "Thank you! I go every weekend.",
				time: "12:45 PM",
			},
			{
				sender: "Sarah",
				text: "Hey! How's your week going so far?",
				time: "1:00 PM",
			},
		],
	},
	{
		id: 2,
		firstName: "Jessica",
		lastName: "Miller",
		birthday: "1991-08-25",
		gender: "Female",
		bio: "Design enthusiast and plant mom.",
		interests: "Plants, Art, Design",
		pfp1: {},
		time: "12:45 PM",
		text: "Haha, that's hilarious! 😂",
		messages: [
			{
				sender: "Me",
				text: "I tried to keep a cactus alive once and failed.",
				time: "12:40 PM",
			},
			{
				sender: "Jessica",
				text: "Haha, that's hilarious! 😂",
				time: "12:45 PM",
			},
		],
	},
	{
		id: 3,
		firstName: "Emily",
		lastName: "Davis",
		birthday: "1996-11-03",
		gender: "Female",
		bio: "Always down for live music and tacos.",
		interests: "Concerts, Tacos, Yoga",
		pfp1: {},
		time: "11:30 AM",
		text: "Are we still on for coffee tomorrow?",
		messages: [
			{
				sender: "Emily",
				text: "I know a great spot downtown.",
				time: "11:00 AM",
			},
			{ sender: "Me", text: "Perfect, let's do it.", time: "11:15 AM" },
			{
				sender: "Emily",
				text: "Are we still on for coffee tomorrow?",
				time: "11:30 AM",
			},
		],
	},
	{
		id: 4,
		firstName: "Ashley",
		lastName: "Clark",
		birthday: "1994-05-19",
		gender: "Female",
		bio: "Aspiring writer and foodie.",
		interests: "Writing, Baking, Travel",
		pfp1: {},
		time: "10:15 AM",
		text: "I just saw that movie too, the ending was crazy!",
		messages: [
			{
				sender: "Me",
				text: "Did you catch the new thriller that just came out?",
				time: "9:30 AM",
			},
			{
				sender: "Ashley",
				text: "I just saw that movie too, the ending was crazy!",
				time: "10:15 AM",
			},
		],
	},
	{
		id: 5,
		firstName: "Brittany",
		lastName: "Lewis",
		birthday: "1998-01-30",
		gender: "Female",
		bio: "Fitness fanatic and beach lover.",
		interests: "Fitness, Beach, Running",
		pfp1: {},
		time: "Yesterday",
		text: "Wait, no way. You actually did that?",
		messages: [
			{
				sender: "Me",
				text: "I once ran a marathon without training.",
				time: "Yesterday",
			},
			{
				sender: "Brittany",
				text: "Wait, no way. You actually did that?",
				time: "Yesterday",
			},
		],
	},
	{
		id: 6,
		firstName: "Amanda",
		lastName: "Hall",
		birthday: "1995-07-11",
		gender: "Female",
		bio: "Tech nerd and board game addict.",
		interests: "Board Games, Coding, Sci-Fi",
		pfp1: {},
		time: "Yesterday",
		text: "Sounds like a plan! See you at 7.",
		messages: [
			{
				sender: "Me",
				text: "Want to meet up for some board games?",
				time: "Yesterday",
			},
			{
				sender: "Amanda",
				text: "Sounds like a plan! See you at 7.",
				time: "Yesterday",
			},
		],
	},
	{
		id: 7,
		firstName: "Megan",
		lastName: "Allen",
		birthday: "1999-09-04",
		gender: "Female",
		bio: "Capturing moments through a lens.",
		interests: "Photography, Film, Camping",
		pfp1: {},
		time: "Yesterday",
		text: "Thanks for the recommendation, I'll check it out.",
		messages: [
			{
				sender: "Me",
				text: "You should look into vintage film cameras, they're fun.",
				time: "Yesterday",
			},
			{
				sender: "Megan",
				text: "Thanks for the recommendation, I'll check it out.",
				time: "Yesterday",
			},
		],
	},
	{
		id: 8,
		firstName: "Taylor",
		lastName: "Wright",
		birthday: "1992-12-18",
		gender: "Female",
		bio: "Always planning the next big trip.",
		interests: "Travel, Languages, History",
		pfp1: {},
		time: "Monday",
		text: "So what are you up to this weekend?",
		messages: [
			{
				sender: "Taylor",
				text: "I just got back from Spain!",
				time: "Monday",
			},
			{
				sender: "Me",
				text: "That sounds amazing. How was it?",
				time: "Monday",
			},
			{
				sender: "Taylor",
				text: "So what are you up to this weekend?",
				time: "Monday",
			},
		],
	},
	{
		id: 9,
		firstName: "Rachel",
		lastName: "Scott",
		birthday: "1997-03-27",
		gender: "Female",
		bio: "Dog person and thrift store hunter.",
		interests: "Thrifting, Dogs, Painting",
		pfp1: {},
		time: "Monday",
		text: "OMG yes! I totally agree.",
		messages: [
			{
				sender: "Me",
				text: "Thrifting is basically a treasure hunt.",
				time: "Monday",
			},
			{
				sender: "Rachel",
				text: "OMG yes! I totally agree.",
				time: "Monday",
			},
		],
	},
	{
		id: 10,
		firstName: "Samantha",
		lastName: "Green",
		birthday: "1995-10-12",
		gender: "Female",
		bio: "Outdoor enthusiast and rock climber.",
		interests: "Climbing, Nature, Road Trips",
		pfp1: {},
		time: "Sunday",
		text: "That looks like an amazing trip. Where was the photo taken?",
		messages: [
			{
				sender: "Me",
				text: "Just uploaded a new picture from my road trip.",
				time: "Sunday",
			},
			{
				sender: "Samantha",
				text: "That looks like an amazing trip. Where was the photo taken?",
				time: "Sunday",
			},
		],
	},
	{
		id: 11,
		firstName: "Lauren",
		lastName: "White",
		birthday: "1994-06-08",
		gender: "Female",
		bio: "Animal rescue volunteer.",
		interests: "Dogs, Volunteering, Baking",
		pfp1: {},
		time: "Sunday",
		text: "I'm definitely more of a dog person 🐶",
		messages: [
			{
				sender: "Me",
				text: "Are you a cat or dog person?",
				time: "Sunday",
			},
			{
				sender: "Lauren",
				text: "I'm definitely more of a dog person 🐶",
				time: "Sunday",
			},
		],
	},
	{
		id: 12,
		firstName: "Nicole",
		lastName: "King",
		birthday: "1993-04-22",
		gender: "Female",
		bio: "Workaholic trying to find balance.",
		interests: "Startups, Reading, Wine",
		pfp1: {},
		time: "Saturday",
		text: "Just finished work, finally!",
		messages: [
			{
				sender: "Me",
				text: "How is your Saturday going?",
				time: "Saturday",
			},
			{
				sender: "Nicole",
				text: "Just finished work, finally!",
				time: "Saturday",
			},
		],
	},
	{
		id: 13,
		firstName: "Olivia",
		lastName: "Baker",
		birthday: "1996-12-01",
		gender: "Female",
		bio: "Nurse and avid reader.",
		interests: "Medicine, Books, Coffee",
		pfp1: {},
		time: "Friday",
		text: "Honestly, same. It's been a long day.",
		messages: [
			{
				sender: "Me",
				text: "I am so ready for the weekend.",
				time: "Friday",
			},
			{
				sender: "Olivia",
				text: "Honestly, same. It's been a long day.",
				time: "Friday",
			},
		],
	},
	{
		id: 14,
		firstName: "Emma",
		lastName: "Nelson",
		birthday: "1998-05-15",
		gender: "Female",
		bio: "Musician looking for inspiration.",
		interests: "Music, Guitar, Concerts",
		pfp1: {},
		time: "Friday",
		text: "Let me know when you're free to chat!",
		messages: [
			{
				sender: "Emma",
				text: "I have a crazy story to tell you.",
				time: "Friday",
			},
			{
				sender: "Me",
				text: "I'm in a meeting right now but I want to hear it.",
				time: "Friday",
			},
			{
				sender: "Emma",
				text: "Let me know when you're free to chat!",
				time: "Friday",
			},
		],
	},
	{
		id: 15,
		firstName: "Chloe",
		lastName: "Carter",
		birthday: "1991-09-30",
		gender: "Female",
		bio: "Skydiving instructor.",
		interests: "Extreme Sports, Skydiving, Outdoors",
		pfp1: {},
		time: "Thursday",
		text: "Haha I don't think I could ever do that.",
		messages: [
			{
				sender: "Me",
				text: "I just booked a bungee jumping trip.",
				time: "Thursday",
			},
			{
				sender: "Chloe",
				text: "Haha I don't think I could ever do that.",
				time: "Thursday",
			},
		],
	},
	{
		id: 16,
		firstName: "Sophia",
		lastName: "Mitchell",
		birthday: "1997-02-28",
		gender: "Female",
		bio: "Early bird and morning runner.",
		interests: "Running, Health, Smoothies",
		pfp1: {},
		time: "Thursday",
		text: "Good morning! ☀️",
		messages: [
			{ sender: "Sophia", text: "Good morning! ☀️", time: "Thursday" },
		],
	},
	{
		id: 17,
		firstName: "Mia",
		lastName: "Roberts",
		birthday: "1995-05-10",
		gender: "Female",
		bio: "Sushi addict.",
		interests: "Food, Travel",
		pfp1: {},
		time: "Wednesday",
		text: "Sushi sounds perfect.",
		messages: [
			{ sender: "Me", text: "Craving sushi tonight.", time: "Wednesday" },
			{ sender: "Mia", text: "Sushi sounds perfect.", time: "Wednesday" },
		],
	},
	{
		id: 18,
		firstName: "Ava",
		lastName: "Evans",
		birthday: "1992-11-20",
		gender: "Female",
		bio: "Always reading.",
		interests: "Books, Tea",
		pfp1: {},
		time: "Wednesday",
		text: "What's your favorite book?",
		messages: [
			{
				sender: "Ava",
				text: "What's your favorite book?",
				time: "Wednesday",
			},
		],
	},
	{
		id: 19,
		firstName: "Lily",
		lastName: "Thomas",
		birthday: "1999-01-14",
		gender: "Female",
		bio: "Art student.",
		interests: "Painting, Museums",
		pfp1: {},
		time: "Tuesday",
		text: "I love the modern art museum.",
		messages: [
			{
				sender: "Lily",
				text: "I love the modern art museum.",
				time: "Tuesday",
			},
		],
	},
	{
		id: 20,
		firstName: "Zoe",
		lastName: "Jackson",
		birthday: "1994-08-08",
		gender: "Female",
		bio: "Yoga instructor.",
		interests: "Yoga, Meditation",
		pfp1: {},
		time: "Tuesday",
		text: "Namaste! 🙏",
		messages: [{ sender: "Zoe", text: "Namaste! 🙏", time: "Tuesday" }],
	},
	{
		id: 21,
		firstName: "Harper",
		lastName: "White",
		birthday: "1996-03-25",
		gender: "Female",
		bio: "Amateur chef.",
		interests: "Cooking, Wine",
		pfp1: {},
		time: "Monday",
		text: "I make a mean carbonara.",
		messages: [
			{
				sender: "Harper",
				text: "I make a mean carbonara.",
				time: "Monday",
			},
		],
	},
	{
		id: 22,
		firstName: "Grace",
		lastName: "Harris",
		birthday: "1993-07-19",
		gender: "Female",
		bio: "Thrill seeker.",
		interests: "Rollercoasters, Fairs",
		pfp1: {},
		time: "Sunday",
		text: "Let's go to the theme park!",
		messages: [
			{
				sender: "Grace",
				text: "Let's go to the theme park!",
				time: "Sunday",
			},
		],
	},
	{
		id: 23,
		firstName: "Riley",
		lastName: "Martin",
		birthday: "1998-12-05",
		gender: "Female",
		bio: "Gamer girl.",
		interests: "PC Gaming, Twitch",
		pfp1: {},
		time: "Saturday",
		text: "Who do you main?",
		messages: [
			{ sender: "Riley", text: "Who do you main?", time: "Saturday" },
		],
	},
	{
		id: 24,
		firstName: "Aria",
		lastName: "Thompson",
		birthday: "1991-04-30",
		gender: "Female",
		bio: "Vintage fashion.",
		interests: "Fashion, Thrift",
		pfp1: {},
		time: "Friday",
		text: "Love that jacket.",
		messages: [
			{ sender: "Aria", text: "Love that jacket.", time: "Friday" },
		],
	},
	{
		id: 25,
		firstName: "Haley",
		lastName: "Garcia",
		birthday: "1997-09-12",
		gender: "Female",
		bio: "Podcaster.",
		interests: "True Crime, Audio",
		pfp1: {},
		time: "Thursday",
		text: "Have you heard the latest episode?",
		messages: [
			{
				sender: "Haley",
				text: "Have you heard the latest episode?",
				time: "Thursday",
			},
		],
	},
];

const fakeMaleMatches = [
	{
		id: 1,
		firstName: "Liam",
		lastName: "Johnson",
		birthday: "1992-05-12",
		gender: "Male",
		bio: "Software engineer and weekend cyclist.",
		interests: "Coding, Cycling, Coffee",
		pfp1: {},
		time: "1:00 PM",
		text: "Hey! How's your week going so far?",
		messages: [
			{
				sender: "Me",
				text: "Hey Liam! Love your cycling pics.",
				time: "12:30 PM",
			},
			{
				sender: "Liam",
				text: "Thank you! I ride every weekend.",
				time: "12:45 PM",
			},
			{
				sender: "Liam",
				text: "Hey! How's your week going so far?",
				time: "1:00 PM",
			},
		],
	},
	{
		id: 2,
		firstName: "Noah",
		lastName: "Smith",
		birthday: "1990-11-04",
		gender: "Male",
		bio: "Architect and dog lover.",
		interests: "Design, Dogs, Architecture",
		pfp1: {},
		time: "12:45 PM",
		text: "Haha, that's hilarious! 😂",
		messages: [
			{
				sender: "Me",
				text: "I tried to build a bookshelf once and it collapsed.",
				time: "12:40 PM",
			},
			{
				sender: "Noah",
				text: "Haha, that's hilarious! 😂",
				time: "12:45 PM",
			},
		],
	},
	{
		id: 3,
		firstName: "Oliver",
		lastName: "Williams",
		birthday: "1995-03-19",
		gender: "Male",
		bio: "Musician and pizza connoisseur.",
		interests: "Guitar, Pizza, Vinyls",
		pfp1: {},
		time: "11:30 AM",
		text: "Are we still on for pizza tomorrow?",
		messages: [
			{
				sender: "Oliver",
				text: "I know a great slice shop downtown.",
				time: "11:00 AM",
			},
			{ sender: "Me", text: "Perfect, let's do it.", time: "11:15 AM" },
			{
				sender: "Oliver",
				text: "Are we still on for pizza tomorrow?",
				time: "11:30 AM",
			},
		],
	},
	{
		id: 4,
		firstName: "Lucas",
		lastName: "Brown",
		birthday: "1993-07-22",
		gender: "Male",
		bio: "Gamer and movie critic.",
		interests: "Gaming, Cinema, Sci-Fi",
		pfp1: {},
		time: "10:15 AM",
		text: "I just saw that sci-fi flick too, epic visuals!",
		messages: [
			{
				sender: "Me",
				text: "Did you catch the new sci-fi movie release?",
				time: "9:30 AM",
			},
			{
				sender: "Lucas",
				text: "I just saw that sci-fi flick too, epic visuals!",
				time: "10:15 AM",
			},
		],
	},
	{
		id: 5,
		firstName: "Mason",
		lastName: "Jones",
		birthday: "1997-09-14",
		gender: "Male",
		bio: "Crossfit coach and surfer.",
		interests: "Crossfit, Surfing, Nutrition",
		pfp1: {},
		time: "Yesterday",
		text: "Wait, no way. You actually did that?",
		messages: [
			{
				sender: "Me",
				text: "I once surfed a double overhead wave.",
				time: "Yesterday",
			},
			{
				sender: "Mason",
				text: "Wait, no way. You actually did that?",
				time: "Yesterday",
			},
		],
	},
	{
		id: 6,
		firstName: "Ethan",
		lastName: "Garcia",
		birthday: "1994-01-08",
		gender: "Male",
		bio: "Startup founder and chess player.",
		interests: "Tech, Chess, Strategy",
		pfp1: {},
		time: "Yesterday",
		text: "Sounds like a plan! See you at 7.",
		messages: [
			{
				sender: "Me",
				text: "Want to grab drinks and talk tech?",
				time: "Yesterday",
			},
			{
				sender: "Ethan",
				text: "Sounds like a plan! See you at 7.",
				time: "Yesterday",
			},
		],
	},
	{
		id: 7,
		firstName: "Logan",
		lastName: "Miller",
		birthday: "1998-10-31",
		gender: "Male",
		bio: "Wildlife photographer and hiker.",
		interests: "Photography, Wildlife, Hiking",
		pfp1: {},
		time: "Yesterday",
		text: "Thanks for the tip, I'll check that trail out.",
		messages: [
			{
				sender: "Me",
				text: "You should hike the canyon loop trail, it's gorgeous.",
				time: "Yesterday",
			},
			{
				sender: "Logan",
				text: "Thanks for the tip, I'll check that trail out.",
				time: "Yesterday",
			},
		],
	},
	{
		id: 8,
		firstName: "Elijah",
		lastName: "Davis",
		birthday: "1991-04-17",
		gender: "Male",
		bio: "World traveler and history buff.",
		interests: "Travel, History, Museums",
		pfp1: {},
		time: "Monday",
		text: "So what are you up to this weekend?",
		messages: [
			{
				sender: "Elijah",
				text: "I just got back from Japan!",
				time: "Monday",
			},
			{
				sender: "Me",
				text: "That sounds amazing. How was it?",
				time: "Monday",
			},
			{
				sender: "Elijah",
				text: "So what are you up to this weekend?",
				time: "Monday",
			},
		],
	},
	{
		id: 9,
		firstName: "James",
		lastName: "Rodriguez",
		birthday: "1996-06-25",
		gender: "Male",
		bio: "Cat dad and vinyl collector.",
		interests: "Cats, Vinyls, Indie Rock",
		pfp1: {},
		time: "Monday",
		text: "OMG yes! I totally agree.",
		messages: [
			{
				sender: "Me",
				text: "Vinyl records just sound warmer.",
				time: "Monday",
			},
			{
				sender: "James",
				text: "OMG yes! I totally agree.",
				time: "Monday",
			},
		],
	},
	{
		id: 10,
		firstName: "Benjamin",
		lastName: "Martinez",
		birthday: "1995-12-03",
		gender: "Male",
		bio: "Trail runner and outdoor guide.",
		interests: "Running, Nature, Camping",
		pfp1: {},
		time: "Sunday",
		text: "That looks like an epic view. Where was that?",
		messages: [
			{
				sender: "Me",
				text: "Just uploaded a photo from my backpack trip.",
				time: "Sunday",
			},
			{
				sender: "Benjamin",
				text: "That looks like an epic view. Where was that?",
				time: "Sunday",
			},
		],
	},
	{
		id: 11,
		firstName: "Alexander",
		lastName: "Hernandez",
		birthday: "1994-02-14",
		gender: "Male",
		bio: "Animal shelter volunteer.",
		interests: "Dogs, Volunteering, Cooking",
		pfp1: {},
		time: "Sunday",
		text: "Definitely a dog person 🐕",
		messages: [
			{
				sender: "Me",
				text: "Are you a cat or dog person?",
				time: "Sunday",
			},
			{
				sender: "Alexander",
				text: "Definitely a dog person 🐕",
				time: "Sunday",
			},
		],
	},
	{
		id: 12,
		firstName: "Henry",
		lastName: "Lopez",
		birthday: "1993-08-19",
		gender: "Male",
		bio: "Finance guy seeking creative balance.",
		interests: "Markets, Reading, Craft Beer",
		pfp1: {},
		time: "Saturday",
		text: "Just clocked out, thank goodness!",
		messages: [
			{
				sender: "Me",
				text: "How is your Saturday treating you?",
				time: "Saturday",
			},
			{
				sender: "Henry",
				text: "Just clocked out, thank goodness!",
				time: "Saturday",
			},
		],
	},
	{
		id: 13,
		firstName: "Sebastian",
		lastName: "Gonzalez",
		birthday: "1997-01-29",
		gender: "Male",
		bio: "Physical therapist and book lover.",
		interests: "Health, Literature, Coffee",
		pfp1: {},
		time: "Friday",
		text: "Hard same. It's been a busy week.",
		messages: [
			{
				sender: "Me",
				text: "I am so ready for the weekend.",
				time: "Friday",
			},
			{
				sender: "Sebastian",
				text: "Hard same. It's been a busy week.",
				time: "Friday",
			},
		],
	},
	{
		id: 14,
		firstName: "Jack",
		lastName: "Wilson",
		birthday: "1999-03-11",
		gender: "Male",
		bio: "Drummer and indie music producer.",
		interests: "Music, Drums, Festivals",
		pfp1: {},
		time: "Friday",
		text: "Hit me up whenever you're free!",
		messages: [
			{
				sender: "Jack",
				text: "I heard a wild story today.",
				time: "Friday",
			},
			{
				sender: "Me",
				text: "I'm tied up right now but tell me later!",
				time: "Friday",
			},
			{
				sender: "Jack",
				text: "Hit me up whenever you're free!",
				time: "Friday",
			},
		],
	},
	{
		id: 15,
		firstName: "Owen",
		lastName: "Anderson",
		birthday: "1991-10-05",
		gender: "Male",
		bio: "Rock climbing guide.",
		interests: "Climbing, Bouldering, Outdoors",
		pfp1: {},
		time: "Thursday",
		text: "Haha no way, heights terrify me.",
		messages: [
			{
				sender: "Me",
				text: "I just signed up for rock climbing lessons.",
				time: "Thursday",
			},
			{
				sender: "Owen",
				text: "Haha no way, heights terrify me.",
				time: "Thursday",
			},
		],
	},
	{
		id: 16,
		firstName: "Gabriel",
		lastName: "Thomas",
		birthday: "1998-07-08",
		gender: "Male",
		bio: "Early riser and marathoner.",
		interests: "Running, Endurance, Juicing",
		pfp1: {},
		time: "Thursday",
		text: "Morning! Let's crush today ☕",
		messages: [
			{
				sender: "Gabriel",
				text: "Morning! Let's crush today ☕",
				time: "Thursday",
			},
		],
	},
	{
		id: 17,
		firstName: "Carter",
		lastName: "Moore",
		birthday: "1995-02-14",
		gender: "Male",
		bio: "Car enthusiast.",
		interests: "Cars, Racing",
		pfp1: {},
		time: "Wednesday",
		text: "Nice ride!",
		messages: [{ sender: "Carter", text: "Nice ride!", time: "Wednesday" }],
	},
	{
		id: 18,
		firstName: "Jayden",
		lastName: "Taylor",
		birthday: "1993-09-22",
		gender: "Male",
		bio: "Sneakerhead.",
		interests: "Sneakers, Fashion",
		pfp1: {},
		time: "Wednesday",
		text: "Did you cop the new release?",
		messages: [
			{
				sender: "Jayden",
				text: "Did you cop the new release?",
				time: "Wednesday",
			},
		],
	},
	{
		id: 19,
		firstName: "Luke",
		lastName: "Anderson",
		birthday: "1997-12-01",
		gender: "Male",
		bio: "Gym rat.",
		interests: "Weightlifting, Nutrition",
		pfp1: {},
		time: "Tuesday",
		text: "Leg day is the best day.",
		messages: [
			{
				sender: "Luke",
				text: "Leg day is the best day.",
				time: "Tuesday",
			},
		],
	},
	{
		id: 20,
		firstName: "Isaac",
		lastName: "Thomas",
		birthday: "1991-04-18",
		gender: "Male",
		bio: "Bartender.",
		interests: "Mixology, Nightlife",
		pfp1: {},
		time: "Tuesday",
		text: "I'll make you a drink.",
		messages: [
			{
				sender: "Isaac",
				text: "I'll make you a drink.",
				time: "Tuesday",
			},
		],
	},
	{
		id: 21,
		firstName: "Leo",
		lastName: "Jackson",
		birthday: "1999-11-30",
		gender: "Male",
		bio: "Skater.",
		interests: "Skateboarding, Punk",
		pfp1: {},
		time: "Monday",
		text: "Let's hit the park.",
		messages: [
			{ sender: "Leo", text: "Let's hit the park.", time: "Monday" },
		],
	},
	{
		id: 22,
		firstName: "Julian",
		lastName: "White",
		birthday: "1994-06-25",
		gender: "Male",
		bio: "Actor.",
		interests: "Theater, Film",
		pfp1: {},
		time: "Sunday",
		text: "Rehearsals all day.",
		messages: [
			{ sender: "Julian", text: "Rehearsals all day.", time: "Sunday" },
		],
	},
	{
		id: 23,
		firstName: "Wyatt",
		lastName: "Harris",
		birthday: "1992-01-09",
		gender: "Male",
		bio: "Cowboy at heart.",
		interests: "Country, Horses",
		pfp1: {},
		time: "Saturday",
		text: "Yeehaw!",
		messages: [{ sender: "Wyatt", text: "Yeehaw!", time: "Saturday" }],
	},
	{
		id: 24,
		firstName: "Dylan",
		lastName: "Martin",
		birthday: "1996-08-14",
		gender: "Male",
		bio: "DJ.",
		interests: "EDM, Festivals",
		pfp1: {},
		time: "Friday",
		text: "Are you going to the festival?",
		messages: [
			{
				sender: "Dylan",
				text: "Are you going to the festival?",
				time: "Friday",
			},
		],
	},
	{
		id: 25,
		firstName: "Ryan",
		lastName: "Garcia",
		birthday: "1998-03-05",
		gender: "Male",
		bio: "Law student.",
		interests: "Law, Debate",
		pfp1: {},
		time: "Thursday",
		text: "I rest my case.",
		messages: [
			{ sender: "Ryan", text: "I rest my case.", time: "Thursday" },
		],
	},
];

let users = [
	{
		firstName: "Parker",
		lastName: "Hemming",
		birthday: "2001-12-09",
		gender: "Male",
		email: "parker@hemm.ing",
		password:
			"$2b$10$BnAx6pRiaz28g/6dQxchO.bwCiBMwFo5Ttzn0Odn7xeloFD/brrJ.",
		bio: "This is my bio!",
		interests: "Hiking, movies, gym",
		pfp1: {},
		pfp2: {},
		pfp3: {},
		pfp4: {},
		coins: 0,
		boost: 0,
		matches: JSON.parse(JSON.stringify(fakeFemaleMatches)),
		notifications: generateNotifications(fakeFemaleMatches),
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

apiRouter.delete("/auth/logout", async (req, res) => {
	try {
		const user = await findUser("token", req.cookies["token"]);
		if (user) delete user.token;
		res.clearCookie("token");
		res.status(204).end();
	} catch {
		res.sendStatus(500);
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

apiRouter.post("/match/message", verifyAuth, async (req, res) => {
	const { matchId, message } = req.body;
	const match = req.user.matches.find((m) => m.id === matchId);

	if (match) {
		match.messages.push(message);
		match.text = message.text;
		match.time = message.time;

		const { password, ...updatedUser } = req.user;
		res.status(200).send(updatedUser);
	} else {
		res.status(404).send({ msg: "Match not found" });
	}
});

apiRouter.delete("/match/:id", verifyAuth, async (req, res) => {
	const matchId = parseInt(req.params.id);
	req.user.matches = req.user.matches.filter((m) => m.id !== matchId);

	const { password, ...updatedUser } = req.user;
	res.status(200).send(updatedUser);
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

function generateNotifications(matches) {
	const firstMatch = matches.length > 0 ? matches[0] : null;
	const newMatchNotification = firstMatch
		? [
				{
					id: 2,
					text: `You got a new match! ${firstMatch.firstName} liked your profile in Match Mode 3.`,
					link: "/message",
					state: firstMatch,
					icon: "fa-message",
					time: "10 mins ago",
				},
			]
		: [];

	return [
		{
			id: 1,
			text: "Ryan and Sarah, a pair you matched, just hit 50 messages!",
			action: "+50",
			icon: "fa-coins",
			time: "Just now",
		},
		...newMatchNotification,
		{
			id: 3,
			text: "The Consensus Engine agrees with your last 5 pairings. Great matchmaking!",
			action: "+25",
			icon: "fa-coins",
			time: "45 mins ago",
		},
		{
			id: 4,
			text: "Ouch. A pair you strongly recommended just unmatched.",
			action: "-15",
			icon: "fa-coins",
			time: "2 hours ago",
		},
		{
			id: 5,
			text: "Daily Login Bonus! The dynamic coin economy is booming today.",
			action: "+20",
			icon: "fa-coins",
			time: "5 hours ago",
		},
		{
			id: 6,
			text: "You successfully paired 10 couples in Match Mode 2 today!",
			action: "+30",
			icon: "fa-coins",
			time: "Yesterday",
		},
		{
			id: 7,
			text: "A pair you made exchanged phone numbers!",
			action: "+100",
			icon: "fa-coins",
			time: "Yesterday",
		},
		{
			id: 8,
			text: "You purchased the 'Cupid's Arrow' profile badge from the store.",
			action: "-500",
			icon: "fa-coins",
			time: "2 days ago",
		},
		{
			id: 9,
			text: "A pair you matched reported a bad interaction.",
			action: "-50",
			icon: "fa-coins",
			time: "3 days ago",
		},
		{
			id: 10,
			text: "Your matchmaking accuracy is in the top 10% this week. Keep it up!",
			action: "+75",
			icon: "fa-coins",
			time: "4 days ago",
		},
	];
}

function findUser(field, value) {
	if (!value) return null;
	return users.find((user) => user[field] === value);
}

async function createUser(data) {
	data.password = await bcrypt.hash(data.password, 10);
	const matches =
		data.gender.toLowerCase() === "male"
			? JSON.parse(JSON.stringify(fakeFemaleMatches))
			: JSON.parse(JSON.stringify(fakeMaleMatches));
	const notifications = generateNotifications(matches);

	const user = {
		...data,
		matches,
		notifications,
		coins: 0,
		boost: 0,
		token: uuid.v4(),
	};
	users.push(user);
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

const httpService = app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
