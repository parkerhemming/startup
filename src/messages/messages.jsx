import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./messages.module.css";

export function Messages({ setUser, user }) {
	const conversations = [...(user?.matches || [])].sort(
		(a, b) => (b.timestamp || 0) - (a.timestamp || 0),
	);

	useEffect(() => {
		document.title = "Messages | Proxy Dating";
	}, []);

	return (
		<div className={styles.messagesContainer}>
			<header className={styles.header}>
				{conversations.map((matchUser) => (
					<Link
						key={`story-${matchUser.id}`}
						to={`/message`}
						state={{ user: matchUser }}
						draggable={false}
					>
						<img
							src={
								matchUser.profilePics?.[0] ||
								`/pfp-${matchUser.gender?.toLowerCase() || "male"}.png`
							}
							alt={`${matchUser.firstName} profile`}
							draggable={false}
						/>
					</Link>
				))}
			</header>

			<main className={styles.main}>
				{conversations.map((matchUser) => {
					const latestText = matchUser.text || "Tap to say hi!";
					const latestTime = matchUser.time || "Just now";

					return (
						<Link
							key={`msg-${matchUser.id}`}
							className={styles.row}
							to={`/message`}
							state={{ user: matchUser }}
							draggable={false}
						>
							<img
								src={
									matchUser.profilePics?.[0] ||
									`/pfp-${matchUser.gender?.toLowerCase() || "male"}.png`
								}
								alt={`${matchUser.firstName} profile`}
								draggable={false}
							/>
							<div className={styles.subrow}>
								<div className={styles.subsubrow}>
									<h2>
										{matchUser.firstName?.toUpperCase()}
									</h2>
									<h2>{latestTime}</h2>
									<i className="fa-solid fa-angle-right"></i>
								</div>
								<h3>{latestText}</h3>
							</div>
						</Link>
					);
				})}
			</main>
		</div>
	);
}
