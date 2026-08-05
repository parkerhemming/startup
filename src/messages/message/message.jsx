import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./message.module.css";
import { increment, toProperCase } from "../../utils";

export function Message({ setUser, user: loggedInUser, setUnreadMatches }) {
	const location = useLocation();
	const navigate = useNavigate();

	const matchUser = location.state?.user || {};
	const currentMatch =
		loggedInUser?.matches?.find((m) => m.id === matchUser.id) || matchUser;

	const displayMessages = currentMatch.messages || [];

	const matchmakersCount =
		currentMatch.matchmakers?.length || (currentMatch.pairedBy ? 1 : 0);

	const [inputText, setInputText] = useState("");
	const messagesEndRef = useRef(null);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [displayMessages]);

	const handleUnmatch = async (e) => {
		e.preventDefault();
		await increment("coins", -10, setUser);

		try {
			const res = await fetch(`/api/match/${currentMatch.id}`, {
				method: "DELETE",
			});
			if (res.ok) {
				const updatedUser = await res.json();
				setUser(updatedUser);
				navigate("/messages");
			}
		} catch (err) {
			console.error("Error unmatching:", err);
		}
	};

	const handleSend = async (e) => {
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

		setInputText("");

		try {
			const res = await fetch("/api/message", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					matchId: currentMatch.id,
					message: newMessage,
				}),
			});

			if (res.ok) {
				const updatedUser = await res.json();
				setUser(updatedUser);
			}
		} catch (err) {
			console.error("Failed to save message:", err);
		}
	};

	useEffect(() => {
		if (currentMatch.firstName) {
			document.title = `Message ${toProperCase(currentMatch.firstName)} | Proxy Dating`;
		}
	}, [currentMatch.firstName]);

	useEffect(() => {
		if (!loggedInUser || !currentMatch?.id) return;

		const matchStillExists = loggedInUser.matches?.some(
			(m) => m.id === currentMatch.id,
		);

		if (!matchStillExists) {
			navigate("/messages", { replace: true });
		}
	}, [loggedInUser, currentMatch?.id, navigate]);

	const profilePic =
		currentMatch.profilePics?.[0] ||
		(currentMatch.gender
			? `/pfp-${currentMatch.gender.toLowerCase()}.png`
			: "/pfp-female.png");

	const displayName = currentMatch.firstName
		? currentMatch.firstName.toUpperCase()
		: "USER";

	useEffect(() => {
		if (setUnreadMatches) {
			setUnreadMatches((prev) => {
				const newSet = new Set(prev);
				newSet.delete(currentMatch.id);
				return newSet;
			});
		}
	}, [currentMatch.id, setUnreadMatches]);

	return (
		<div className={styles.container}>
			<header className={styles.header}>
				<Link to="/messages" className={styles.backBtn}>
					<i className="fa-solid fa-angle-left"></i>
				</Link>

				<Link
					to="/profile-view"
					state={{ user: currentMatch }}
					className={styles.profileLink}
				>
					<div className={styles.avatarWrapper}>
						<img
							src={profilePic}
							width="42"
							height="42"
							alt={displayName}
							draggable={false}
						/>
					</div>
					<h2>{displayName}</h2>
				</Link>

				<button className={styles.unmatchBtn} onClick={handleUnmatch}>
					<span>Unmatch</span>
					<span className={styles.cost}>
						-10 <i className="fa-solid fa-coins"></i>
					</span>
				</button>

				{matchmakersCount > 0 && (
					<div className={styles.pairedBubble}>
						<span>
							{matchmakersCount === 1
								? "1 person paired you together"
								: `${matchmakersCount} people paired you together`}
						</span>
					</div>
				)}
			</header>

			<main className={styles.main}>
				{displayMessages.map((msg, index) => (
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
