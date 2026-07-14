import React, { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import styles from "./message.module.css";
import { toProperCase, updateCoins } from "../../utils";

export function Message() {
	const [searchParams] = useSearchParams();
	const id = searchParams.get("id");
	const name = searchParams.get("name");

	const [messages, setMessages] = useState([
		{ id: 1, sender: "me", text: "Hi" },
		{ id: 2, sender: "them", text: "Hello!" },
		{ id: 3, sender: "me", text: "You're cool" },
		{ id: 4, sender: "them", text: "Thx" },
	]);

	const [inputText, setInputText] = useState("");
	const messagesEndRef = useRef(null);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const handleSend = (e) => {
		e.preventDefault();
		if (!inputText.trim()) return;
		const newMessage = {
			id: Date.now(),
			sender: "me",
			text: inputText,
		};
		setMessages((prev) => [...prev, newMessage]);
		setInputText("");
	};

	useEffect(() => {
		document.title = `Message ${toProperCase(name)} | Proxy Dating`;
	}, []);

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
						alt={name}
					/>
					<h2>{name}</h2>
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
