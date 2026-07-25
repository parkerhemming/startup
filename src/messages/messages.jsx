import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./messages.module.css";
import { getUser } from "../utils";

export function Messages() {
	const currentUser = getUser() || {};
	const conversations = currentUser.matches || [];

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
