import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./messages.module.css";

export function Messages() {
	const conversations = [
		{
			id: 1,
			name: "SARAH",
			time: "1:00 PM",
			text: "Hey! How's your week going so far?",
			image: "/pfp-female.png",
		},
		{
			id: 2,
			name: "JESSICA",
			time: "12:45 PM",
			text: "Haha, that's hilarious! 😂",
			image: "/pfp-female.png",
		},
		{
			id: 3,
			name: "EMILY",
			time: "11:30 AM",
			text: "Are we still on for coffee tomorrow?",
			image: "/pfp-female.png",
		},
		{
			id: 4,
			name: "ASHLEY",
			time: "10:15 AM",
			text: "I just saw that movie too, the ending was crazy!",
			image: "/pfp-female.png",
		},
		{
			id: 5,
			name: "BRITTANY",
			time: "Yesterday",
			text: "Wait, no way. You actually did that?",
			image: "/pfp-female.png",
		},
		{
			id: 6,
			name: "AMANDA",
			time: "Yesterday",
			text: "Sounds like a plan! See you at 7.",
			image: "/pfp-female.png",
		},
		{
			id: 7,
			name: "MEGAN",
			time: "Yesterday",
			text: "Thanks for the recommendation, I'll check it out.",
			image: "/pfp-female.png",
		},
		{
			id: 8,
			name: "TAYLOR",
			time: "Monday",
			text: "So what are you up to this weekend?",
			image: "/pfp-female.png",
		},
		{
			id: 9,
			name: "RACHEL",
			time: "Monday",
			text: "OMG yes! I totally agree.",
			image: "/pfp-female.png",
		},
		{
			id: 10,
			name: "SAMANTHA",
			time: "Sunday",
			text: "That looks like an amazing trip. Where was the photo taken?",
			image: "/pfp-female.png",
		},
		{
			id: 11,
			name: "LAUREN",
			time: "Sunday",
			text: "I'm definitely more of a dog person 🐶",
			image: "/pfp-female.png",
		},
		{
			id: 12,
			name: "NICOLE",
			time: "Saturday",
			text: "Just finished work, finally!",
			image: "/pfp-female.png",
		},
		{
			id: 13,
			name: "OLIVIA",
			time: "Friday",
			text: "Honestly, same. It's been a long day.",
			image: "/pfp-female.png",
		},
		{
			id: 14,
			name: "EMMA",
			time: "Friday",
			text: "Let me know when you're free to chat!",
			image: "/pfp-female.png",
		},
		{
			id: 15,
			name: "CHLOE",
			time: "Thursday",
			text: "Haha I don't think I could ever do that.",
			image: "/pfp-female.png",
		},
		{
			id: 16,
			name: "SOPHIA",
			time: "Thursday",
			text: "Good morning! ☀️",
			image: "/pfp-female.png",
		},
	];

	useEffect(() => {
		document.title = "Messages | Proxy Dating";
	}, []);

	return (
		<div className={styles.messagesContainer}>
			<header className={styles.header}>
				{conversations.map((user) => (
					<Link
						key={`story-${user.id}`}
						to={`/message?id=${user.id}&name=${user.name}`}
						draggable={false}
					>
						<img
							src={user.image}
							alt={`${user.name} profile`}
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
						to={`/message?id=${user.id}&name=${user.name}`}
						draggable={false}
					>
						<img
							src={user.image}
							alt={`${user.name} profile`}
							draggable={false}
						/>
						<div className={styles.subrow}>
							<div className={styles.subsubrow}>
								<h2>{user.name}</h2>
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
