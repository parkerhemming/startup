import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./messages.module.css";
import { Loading, SmartImage } from "../shared.jsx";
import { pairCount } from "../utils";

export function Messages({ user }) {
	const conversations = [...(user?.matches || [])].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

	useEffect(() => { document.title = "Messages | Proxy Dating"; }, []);
	if (!user) return <Loading text="Loading messages" />;

	return <div className={styles.messagesContainer}>
		<header className={styles.header}>{conversations.map((match) => <Link key={match.id} to="/message" state={{ user: match }} draggable={false} className="iconCircle">
			<SmartImage user={match} alt={`${match.firstName} profile`} />
			{match.online && <span className="onlineDot"></span>}
		</Link>)}</header>
		<main className={styles.main}>{conversations.map((match) => <Link key={match.id} className={styles.row} to="/message" state={{ user: match }} draggable={false}>
			<div className="iconCircle"><SmartImage user={match} alt={`${match.firstName} profile`} />{match.online && <span className="onlineDot"></span>}{!match.read && <span className="noticeDot"></span>}</div>
			<div className={styles.subrow}>
				<div className={styles.subsubrow}><h2>{match.firstName?.toUpperCase()}</h2><h2>{match.time || "Just now"}</h2><i className="fa-solid fa-angle-right"></i></div>
				<h3>{match.text || "Tap to say hi!"}</h3>
				{pairCount(match) > 0 && <p>{pairCount(match)} {pairCount(match) === 1 ? "person" : "people"} paired you together</p>}
			</div>
		</Link>)}</main>
	</div>;
}
