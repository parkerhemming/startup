import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./store.module.css";
import {
	getUser,
	getCoins,
	getBoost,
	updateBoost,
	updateCoins,
} from "../utils";

export function Store() {
	const navigate = useNavigate();
	const [coins, setCoins] = useState(getCoins());
	const [boost, setBoost] = useState(getBoost());
	const user = getUser();

	const [joke, setJoke] = useState({
		setup: "Loading joke...",
		punchline: "",
	});
	const [loadingJoke, setLoadingJoke] = useState(false);

	const fetchJoke = async () => {
		setLoadingJoke(true);
		try {
			const response = await fetch(
				"https://official-joke-api.appspot.com/random_joke",
			);
			if (!response.ok) throw new Error("Failed to fetch joke");
			const data = await response.json();
			setJoke(data);
		} catch (error) {
			console.error(error);
			setJoke({
				setup: "Could not load a joke right now.",
				punchline: "Check your connection!",
			});
		} finally {
			setLoadingJoke(false);
		}
	};

	useEffect(() => {
		document.title = "Store | Proxy Dating";
		fetchJoke();
	}, []);

	return (
		<main className={styles.main}>
			<section className={`${styles.section} ${styles.dashboardSummary}`}>
				<div className={styles.statsRow}>
					<div className={styles.statBox}>
						<h3>My Balance</h3>
						<h2 style={{ color: coins < 0 ? "red" : "inherit" }}>
							{coins ?? 0} <i className="fa-solid fa-coins"></i>
						</h2>
					</div>
					<div className={styles.statBox}>
						<h3>Active Pairs</h3>
						<h2>
							14 <i className="fa-solid fa-user-group"></i>
						</h2>
					</div>
				</div>
				<div className={styles.summaryNote}>
					<p>
						<i className="fa-solid fa-circle-info"></i>
						Active Pairs are couples you have matched together. You
						earn passive income (+1 coin) every time they message,
						but you take a hit (-10 coins) if they unmatch!
					</p>
				</div>
			</section>

			<section className={styles.section}>
				<div className={styles.sectionHeader}>
					<h1>STORE</h1>
					<p>Spend coins to upgrade your matchmaking experience.</p>
				</div>

				<div className={styles.storeItem}>
					<div className={styles.iconWrap}>
						<i className="fa-solid fa-eye"></i>
					</div>
					<div className={styles.textWrap}>
						<h2>Profile Boost</h2>
						<p>
							Your profile will be shown to others {boost ?? 0}{" "}
							more times.
						</p>
					</div>
					<button
						disabled={coins < 15}
						className="btn"
						onClick={() => {
							updateBoost(1);
							setCoins(getCoins());
							setBoost(getBoost());
						}}
					>
						<span>15</span>
						<i className="fa-solid fa-coins"></i>
					</button>
				</div>

				<div className={styles.storeItem}>
					<div className={styles.iconWrap}>
						<i className="fa-solid fa-hand-pointer"></i>
					</div>
					<div className={styles.textWrap}>
						<h2>Match Me</h2>
						<p>Choose your own match.</p>
					</div>
					<Link
						disabled={coins < 30}
						draggable={false}
						className="btn"
						to={"/pair-mode-3?mode=me"}
						state={{ user }}
					>
						{" "}
						<span>30</span>
						<i className="fa-solid fa-coins"></i>
					</Link>
				</div>
			</section>

			<section className={styles.section}>
				<div className={styles.sectionHeader}>
					<h1>GUIDE</h1>
					<p>How the dynamic coin economy works</p>
				</div>

				<div className={styles.rulesGrid}>
					<div className={styles.ruleCard}>
						<i className="fa-solid fa-handshake-angle"></i>
						<h2>Pair Others</h2>
						<div className={`${styles.reward} ${styles.positive}`}>
							+5 <i className="fa-solid fa-coins"></i>
						</div>
					</div>
					<div className={styles.ruleCard}>
						<i className="fa-solid fa-comments"></i>
						<h2>Pairs Message</h2>
						<div className={`${styles.reward} ${styles.positive}`}>
							+1 <i className="fa-solid fa-coins"></i>
							<span>/msg</span>
						</div>
					</div>
					<div className={styles.ruleCard}>
						<i className="fa-solid fa-heart-crack"></i>
						<h2>Pairs Unmatch</h2>
						<div className={`${styles.reward} ${styles.negative}`}>
							-10 <i className="fa-solid fa-coins"></i>
						</div>
					</div>
				</div>
			</section>

			<section className={styles.section}>
				<div className={styles.sectionHeader}>
					<h1>JOKE BREAK</h1>
					<p>Powered by a third-party Joke API</p>
				</div>

				<div className={styles.storeItem}>
					<div className={styles.iconWrap}>
						<i className="fa-solid fa-face-laugh-squint"></i>
					</div>
					<div className={styles.textWrap}>
						<h2>Random Dad Joke</h2>
						<p style={{ marginTop: "4px" }}>
							{loadingJoke
								? "Fetching joke..."
								: `${joke.setup} ${joke.punchline}`}
						</p>
					</div>
					<button
						className="btn"
						onClick={fetchJoke}
						disabled={loadingJoke}
					>
						<span>New Joke</span>
					</button>
				</div>
			</section>
		</main>
	);
}
