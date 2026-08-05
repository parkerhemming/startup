import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./message.module.css";
import { increment, pairCount, toProperCase } from "../../utils";
import { SmartImage } from "../../shared.jsx";

export function Message({ setUser, user: loggedInUser }) {
	const location = useLocation();
	const navigate = useNavigate();
	const matchUser = location.state?.user || {};
	const currentMatch = loggedInUser?.matches?.find((m) => m.id === matchUser.id) || matchUser;
	const [inputText, setInputText] = useState("");
	const [typing, setTyping] = useState(false);
	const socketRef = useRef(null);
	const messagesEndRef = useRef(null);

	useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [currentMatch.messages]);
	useEffect(() => { if (currentMatch.id) fetch(`/api/read/${currentMatch.id}`, { method: "POST" }); }, [currentMatch.id]);
	useEffect(() => { if (currentMatch.firstName) document.title = `Message ${toProperCase(currentMatch.firstName)} | Proxy Dating`; }, [currentMatch.firstName]);
	useEffect(() => {
		const protocol = window.location.protocol === "https:" ? "wss" : "ws";
		socketRef.current = new WebSocket(`${protocol}://${window.location.host}`);
		socketRef.current.onmessage = (event) => {
			const data = JSON.parse(event.data);
			if (data.type === "typing" && data.from === currentMatch.id) setTyping(data.isTyping);
		};
		return () => socketRef.current?.close();
	}, [currentMatch.id]);

	async function handleUnmatch(e) {
		e.preventDefault();
		await increment("coins", -10, setUser, `${loggedInUser.firstName} and ${currentMatch.firstName} unmatched`);
		const res = await fetch(`/api/match/${currentMatch.id}`, { method: "DELETE" });
		if (res.ok) { setUser(await res.json()); navigate("/messages"); }
	}

	async function handleSend(e) {
		e.preventDefault();
		if (!inputText.trim()) return;
		const message = { sender: "Me", text: inputText, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
		setInputText("");
		socketRef.current?.send(JSON.stringify({ type: "typing", from: loggedInUser?._id || loggedInUser?.id, to: currentMatch.id, isTyping: false }));
		const res = await fetch("/api/message", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ matchId: currentMatch.id, message }) });
		if (res.ok) setUser(await res.json());
	}

	function updateText(text) {
		setInputText(text);
		socketRef.current?.send(JSON.stringify({ type: "typing", from: loggedInUser?._id || loggedInUser?.id, to: currentMatch.id, isTyping: !!text }));
	}

	return <div className={styles.container}>
		<header className={styles.header}>
			<Link to="/messages" className={styles.backBtn}><i className="fa-solid fa-angle-left"></i></Link>
			<Link to="/profile-view" state={{ user: currentMatch }} className={styles.profileLink}><span className="iconCircle"><SmartImage user={currentMatch} alt={currentMatch.firstName} />{currentMatch.online && <span className="onlineDot"></span>}</span><h2>{currentMatch.firstName?.toUpperCase() || "USER"}</h2></Link>
			<button className={styles.unmatchBtn} onClick={handleUnmatch}><span>Unmatch</span><span className={styles.cost}>-10 <i className="fa-solid fa-coins"></i></span></button>
		</header>
		<main className={styles.main}>
			{pairCount(currentMatch) > 0 && <p className={styles.pairNote}>{pairCount(currentMatch)} {pairCount(currentMatch) === 1 ? "person" : "people"} paired you together</p>}
			{(currentMatch.messages || []).map((msg, index) => <div key={index} className={`${styles.row} ${msg.sender === "Me" ? styles.me : styles.them}`}><p>{msg.text}</p>{msg.sender === "Me" && msg.read && <small>Read</small>}</div>)}
			{typing && <div className={`${styles.row} ${styles.them}`}><p className={styles.typing}>typing...</p></div>}
			<div ref={messagesEndRef} />
		</main>
		<footer className={styles.footer}><form className={styles.form} onSubmit={handleSend}><input id="message" name="message" placeholder="Message..." autoComplete="off" className={styles.input} value={inputText} onChange={(e) => updateText(e.target.value)} /><button type="submit" className={styles.sendBtn}><i className="fa-solid fa-paper-plane"></i></button></form></footer>
	</div>;
}
