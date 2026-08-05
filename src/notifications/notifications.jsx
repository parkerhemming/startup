import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./notifications.module.css";

export function Notifications({ setUser, user }) {
	const navigate = useNavigate();

	const notificationsData = user?.notifications || [];

	useEffect(() => {
		document.title = `${notificationsData.length} Notifications | Proxy Dating`;
	}, [notificationsData.length]);

	const handleNotificationClick = (note) => {
		if (note.link) {
			if (note.link === "/message" && note.state) {
				const matchStillExists = user?.matches?.find(
					(m) => m.id === note.state.id,
				);

				if (matchStillExists) {
					navigate(note.link, { state: { user: matchStillExists } });
				} else {
					alert("You are no longer matched with this user!");
				}
			} else {
				navigate(note.link, { state: { user: note.state } });
			}
		}
	};

	const handleClearAll = async () => {
		try {
			const res = await fetch("/api/notifications", {
				method: "DELETE",
			});
			if (res.ok) {
				const updatedUser = await res.json();
				setUser(updatedUser);
			}
		} catch (err) {
			console.error("Failed to clear notifications:", err);
		}
	};

	if (!user) {
		return (
			<main className={styles.main}>
				<h2 style={{ marginTop: "50px", color: "#555" }}>
					Loading notifications...
				</h2>
			</main>
		);
	}

	return (
		<>
			<header className={styles.header}>
				{notificationsData.length > 0 && (
					<button
						onClick={handleClearAll}
						className={styles.clearBtn}
					>
						Clear All
					</button>
				)}
				<button
					onClick={() => navigate(-1)}
					className={styles.closeBtn}
				>
					<i className="fa-solid fa-xmark"></i>
				</button>
			</header>

			<main className={styles.main}>
				<section className={styles.section}>
					{notificationsData.length === 0 ? (
						<div>
							<h3>No notifications yet</h3>
						</div>
					) : (
						notificationsData.map((note) => (
							<div key={note.id} className={styles.row}>
								<h2>
									{note.text}{" "}
									<span>
										{note.link ? (
											<button
												onClick={() =>
													handleNotificationClick(
														note,
													)
												}
												className={styles.linkBtn}
												title="Go to Match"
											>
												<i
													className={`fa-solid ${note.icon}`}
												></i>
											</button>
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
						))
					)}
				</section>
			</main>
		</>
	);
}
