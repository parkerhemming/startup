import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./message.module.css";
import { toProperCase, updateCoins } from "../../utils";

export function Message() {
	const location = useLocation();
	const user = location.state?.user || {};

	const [messages, setMessages] = useState(user.messages || []);
	const [inputText, setInputText] = useState("");
	const messagesEndRef = useRef(null);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const handleSend = (e) => {
		e.preventDefault();
		if (!inputText.trim()) return;
		const newMessage = {
			sender: "Me",
			text: inputText,
			time: new Date().toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			}),
		};
		setMessages((prev) => [...prev, newMessage]);
		setInputText("");
	};

	useEffect(() => {
		if (user.firstName) {
			document.title = `Message ${toProperCase(user.firstName)} | Proxy Dating`;
		}
	}, [user.firstName]);

	const profilePic =
		user.image ||
		(user.gender
			? `/pfp-${user.gender.toLowerCase()}.png`
			: "/pfp-female.png");
	const displayName = user.firstName ? user.firstName.toUpperCase() : "USER";

	return (
		<div className={styles.container}>
			<header className={styles.header}>
				<Link to="/messages" className={styles.backBtn}>
					<i className="fa-solid fa-angle-left"></i>
				</Link>

				<Link
					to="/profile-view"
					state={{ user }}
					className={styles.profileLink}
				>
					<img
						src={profilePic}
						width="42"
						height="42"
						alt={displayName}
					/>
					<h2>{displayName}</h2>
				</Link>

				<Link
					className={styles.unmatchBtn}
					onClick={() => updateCoins(-10)}
					to="/messages"
				>
					<span>Unmatch</span>
					<span className={styles.cost}>
						-10 <i className="fa-solid fa-coins"></i>
					</span>
				</Link>
			</header>

			<main className={styles.main}>
				{messages.map((msg, index) => (
					<div
						key={index}
						className={`${styles.row} ${
							msg.sender === "Me" ? styles.me : styles.them
						}`}
					>
						<p>{msg.text}</p>
					</div>
				))}
				<div ref={messagesEndRef} />
			</main>

			<footer className={styles.footer}>
				<form className={styles.form} onSubmit={handleSend}>
					<input
						id="message"
						name="message"
						type="text"
						placeholder="Message..."
						autoComplete="off"
						className={styles.input}
						value={inputText}
						onChange={(e) => setInputText(e.target.value)}
					/>
					<button type="submit" className={styles.sendBtn}>
						<i className="fa-solid fa-paper-plane"></i>
					</button>
				</form>
			</footer>
		</div>
	);
}
