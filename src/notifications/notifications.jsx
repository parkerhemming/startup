import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./notifications.module.css";

export function Notifications() {
	const navigate = useNavigate();

	const notificationsData = [
		{
			id: 1,
			text: "Ryan and Sarah, a pair you matched, just hit 50 messages!",
			action: "+50",
			icon: "fa-coins",
			time: "Just now",
		},
		{
			id: 2,
			text: "You got a new match! Someone liked your profile in Match Mode 3.",
			link: "/message",
			state: {
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
			icon: "fa-message",
			time: "10 mins ago",
		},
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

	useEffect(() => {
		document.title = `${notificationsData.length} Notifications | Proxy Dating`;
	}, []);

	return (
		<>
			<header className={styles.header}>
				<button
					onClick={() => navigate(-1)}
					className={styles.closeBtn}
				>
					<i className="fa-solid fa-xmark"></i>
				</button>
			</header>

			<main className={styles.main}>
				<section className={styles.section}>
					{notificationsData.map((note) => (
						<div key={note.id} className={styles.row}>
							<h2>
								{note.text}{" "}
								<span>
									{note.link ? (
										<Link
											to={note.link}
											state={{ user: note.state }}
										>
											<i
												className={`fa-solid ${note.icon}`}
											></i>
										</Link>
									) : (
										<>
											{note.action}
											<i
												className={`fa-solid ${note.icon}`}
											></i>
										</>
									)}
								</span>
							</h2>
							<h3>{note.time}</h3>
						</div>
					))}
				</section>
			</main>
		</>
	);
}
