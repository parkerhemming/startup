import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./messages.module.css";
import { getUser } from "../utils";

export function Messages() {
	const currentUser = getUser();
	const isMale = currentUser?.gender?.toLowerCase() === "male";
	const targetGender = isMale ? "Female" : "Male";

	const maleConversations = [
		{
			id: 1,
			firstName: "Sarah",
			lastName: "Adams",
			birthday: "1993-02-14",
			gender: "Female",
			bio: "Coffee lover and weekend hiker.",
			interests: "Hiking, Coffee, Reading",
			pfp1: {},
			pfp2: {},
			pfp3: {},
			pfp4: {},
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
			pfp2: {},
			pfp3: {},
			pfp4: {},
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
			pfp2: {},
			pfp3: {},
			pfp4: {},
			time: "11:30 AM",
			text: "Are we still on for coffee tomorrow?",
			messages: [
				{
					sender: "Emily",
					text: "I know a great spot downtown.",
					time: "11:00 AM",
				},
				{
					sender: "Me",
					text: "Perfect, let's do it.",
					time: "11:15 AM",
				},
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
			pfp2: {},
			pfp3: {},
			pfp4: {},
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
			pfp2: {},
			pfp3: {},
			pfp4: {},
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
			pfp2: {},
			pfp3: {},
			pfp4: {},
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
			pfp2: {},
			pfp3: {},
			pfp4: {},
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
			pfp2: {},
			pfp3: {},
			pfp4: {},
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
			pfp2: {},
			pfp3: {},
			pfp4: {},
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
			pfp2: {},
			pfp3: {},
			pfp4: {},
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
			pfp2: {},
			pfp3: {},
			pfp4: {},
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
			pfp2: {},
			pfp3: {},
			pfp4: {},
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
			pfp2: {},
			pfp3: {},
			pfp4: {},
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
			pfp2: {},
			pfp3: {},
			pfp4: {},
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
			pfp2: {},
			pfp3: {},
			pfp4: {},
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
			pfp2: {},
			pfp3: {},
			pfp4: {},
			time: "Thursday",
			text: "Good morning! ☀️",
			messages: [
				{
					sender: "Sophia",
					text: "Good morning! ☀️",
					time: "Thursday",
				},
			],
		},
	];

	const femaleConversations = [
		{
			id: 1,
			firstName: "Liam",
			lastName: "Johnson",
			birthday: "1992-05-12",
			gender: "Male",
			bio: "Software engineer and weekend cyclist.",
			interests: "Coding, Cycling, Coffee",
			pfp1: {},
			pfp2: {},
			pfp3: {},
			pfp4: {},
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
			pfp2: {},
			pfp3: {},
			pfp4: {},
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
			pfp2: {},
			pfp3: {},
			pfp4: {},
			time: "11:30 AM",
			text: "Are we still on for pizza tomorrow?",
			messages: [
				{
					sender: "Oliver",
					text: "I know a great slice shop downtown.",
					time: "11:00 AM",
				},
				{
					sender: "Me",
					text: "Perfect, let's do it.",
					time: "11:15 AM",
				},
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
			pfp2: {},
			pfp3: {},
			pfp4: {},
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
			pfp2: {},
			pfp3: {},
			pfp4: {},
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
			pfp2: {},
			pfp3: {},
			pfp4: {},
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
			pfp2: {},
			pfp3: {},
			pfp4: {},
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
			pfp2: {},
			pfp3: {},
			pfp4: {},
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
			pfp2: {},
			pfp3: {},
			pfp4: {},
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
			pfp2: {},
			pfp3: {},
			pfp4: {},
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
			pfp2: {},
			pfp3: {},
			pfp4: {},
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
			pfp2: {},
			pfp3: {},
			pfp4: {},
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
			pfp2: {},
			pfp3: {},
			pfp4: {},
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
			pfp2: {},
			pfp3: {},
			pfp4: {},
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
			pfp2: {},
			pfp3: {},
			pfp4: {},
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
			pfp2: {},
			pfp3: {},
			pfp4: {},
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
	];

	const conversations = isMale ? maleConversations : femaleConversations;

	useEffect(() => {
		document.title = "Messages | Proxy Dating";
	}, []);

	return (
		<div className={styles.messagesContainer}>
			<header className={styles.header}>
				{conversations.map((user) => (
					<Link
						key={`story-${user.id}`}
						to={`/message`}
						state={{ user }}
						draggable={false}
					>
						<img
							src={`/pfp-${user.gender.toLowerCase()}.png`}
							alt={`${user.firstName} profile`}
							draggable={false}
						/>
					</Link>
				))}
			</header>

			<main className={styles.main}>
				{conversations.map((user) => (
					<Link
						key={`msg-${user.id}`}
						className={styles.row}
						to={`/message`}
						state={{ user }}
						draggable={false}
					>
						<img
							src={`/pfp-${user.gender.toLowerCase()}.png`}
							alt={`${user.firstName} profile`}
							draggable={false}
						/>
						<div className={styles.subrow}>
							<div className={styles.subsubrow}>
								<h2>{user.firstName.toUpperCase()}</h2>
								<h2>{user.time}</h2>
								<i className="fa-solid fa-angle-right"></i>
							</div>
							<h3>{user.text}</h3>
						</div>
					</Link>
				))}
			</main>
		</div>
	);
}
