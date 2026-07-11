import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./message.module.css";

export function Message() {
	// State to hold the chat history
	const [messages, setMessages] = useState([
		{ id: 1, sender: "me", text: "Hi" },
		{ id: 2, sender: "them", text: "Hello!" },
		{ id: 3, sender: "me", text: "You're cool" },
		{ id: 4, sender: "them", text: "Thx" },
	]);

	// State for the text input
	const [inputText, setInputText] = useState("");

	// Handle sending a new message
	const handleSend = (e) => {
		e.preventDefault();
		if (!inputText.trim()) return;

		const newMessage = {
			id: Date.now(),
			sender: "me",
			text: inputText,
		};

		setMessages((prev) => [...prev, newMessage]);
		setInputText(""); // Clear the input
	};

	return (
		<div className={styles.container}>
			<header className={styles.header}>
				<Link to="/messages" className={styles.backBtn}>
					<i className="fa-solid fa-angle-left"></i>
				</Link>

				<Link to="/profile-view" className={styles.profileLink}>
					<img
						src="/pfp-female.png"
						width="42"
						height="42"
						alt="ASHLEY"
					/>
					<h2>ASHLEY</h2>
				</Link>

				<button className={styles.unmatchBtn}>
					<span>Unmatch</span>
					<span className={styles.cost}>
						-10 <i className="fa-solid fa-coins"></i>
					</span>
				</button>
			</header>

			<main className={styles.main}>
				{messages.map((msg) => (
					<div
						key={msg.id}
						className={`${styles.row} ${
							msg.sender === "me" ? styles.me : styles.them
						}`}
					>
						<p>{msg.text}</p>
					</div>
				))}
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
