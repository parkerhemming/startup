import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./store.module.css";
import { increment } from "../utils";

export function Store({ setUser, user }) {
	const navigate = useNavigate();

	const [joke, setJoke] = useState({
		setup: "Need a laugh?",
		punchline: "Buy a random dad joke!",
	});
	const [loadingJoke, setLoadingJoke] = useState(false);

	const fetchJoke = async () => {
		setLoadingJoke(true);
		try {
			const response = await fetch("/api/joke");
			if (!response.ok) throw new Error("Failed to fetch joke");
			const data = await response.json();
			setJoke(data);
		} catch (error) {
			console.error("Failed to fetch joke:", error);
			setJoke({
				setup: "Could not load a joke right now.",
				punchline: "Check your connection!",
			});
		} finally {
			setLoadingJoke(false);
		}
	};

	const handleBuyJoke = async () => {
		if (user.coins >= 1) {
			await increment("coins", -1, setUser);
			await fetchJoke();
		}
	};

	useEffect(() => {
		document.title = "Store | Proxy Dating";
	}, []);

	if (!user) {
		return (
			<main className={styles.main}>
				<h2>Loading store...</h2>
			</main>
		);
	}

	return (
		<main className={styles.main}>
			<section className={`${styles.section} ${styles.dashboardSummary}`}>
				<div className={styles.statsRow}>
					<div className={styles.statBox}>
						<h3>My Balance</h3>
						<h2
							style={{
								color: user.coins < 0 ? "red" : "inherit",
							}}
						>
							{user.coins ?? 0}{" "}
							<i className="fa-solid fa-coins"></i>
						</h2>
					</div>
					<div className={styles.statBox}>
						<h3>Active Pairs</h3>
						<h2>
							{user.activePairs ?? 0}{" "}
							<i className="fa-solid fa-user-group"></i>
						</h2>
					</div>
				</div>
			</section>

			<section className={styles.section}>
				<div className={styles.sectionHeader}>
					<h1>STORE</h1>
					<p>Spend coins to upgrade your matchmaking experience.</p>
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
						className="btn"
						to={"/pair-mode-3?mode=me"}
						state={{ user }}
						style={
							user.coins < 30
								? { pointerEvents: "none", opacity: 0.5 }
								: {}
						}
					>
						{" "}
						<span>30</span>
						<i className="fa-solid fa-coins"></i>
					</Link>
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
						onClick={handleBuyJoke}
						disabled={loadingJoke || user.coins < 1}
					>
						<span>1</span>
						<i className="fa-solid fa-coins"></i>
					</button>
				</div>
			</section>

			<section className={styles.section}>
				<div className={styles.sectionHeader}>
					<h1>GUIDE</h1>
					<p>The concept of Proxy Dating</p>
				</div>

				<div className={styles.conceptCard}>
					<div className={styles.conceptStep}>
						<div className={styles.conceptIcon}>
							<i className="fa-solid fa-people-arrows"></i>
						</div>
						<div className={styles.conceptText}>
							<h3>Play Matchmaker</h3>
							<p>
								Instead of swiping on dates for yourself, you
								browse grids of other single users and
								drag-and-drop compatible profiles together to
								create matches.
							</p>
						</div>
					</div>

					<div className={styles.conceptStep}>
						<div className={styles.conceptIcon}>
							<i className="fa-solid fa-chart-line"></i>
						</div>
						<div className={styles.conceptText}>
							<h3>Build Passive Income</h3>
							<p>
								Every successful couple you create becomes an{" "}
								<strong>Active Pair</strong>. Whenever they chat
								with other, you collect passive coins. The
								better your matches, the more coins you make!
							</p>
						</div>
					</div>

					<div className={styles.conceptStep}>
						<div className={styles.conceptIcon}>
							<i className="fa-solid fa-shield-halved"></i>
						</div>
						<div className={styles.conceptText}>
							<h3>Quality Over Quantity</h3>
							<p>
								Choose wisely! If a couple you match hits it
								off, you rake in steady coins. But if they hate
								each other and unmatch, you take a coin penalty.
								Match smart to keep your balance growing.
							</p>
						</div>
					</div>

					<div className={styles.conceptStep}>
						<div className={styles.conceptIcon}>
							<i className="fa-solid fa-heart"></i>
						</div>
						<div className={styles.conceptText}>
							<h3>Get Your Own Dates</h3>
							<p>
								While you are out pairing others, your profile
								is actively shown on other matchmakers' boards.
								When a matchmaker pairs you with someone else,
								you get notified and a new chat opens up—that is
								how you find your own dates!
							</p>
						</div>
					</div>
				</div>
			</section>

			<section className={styles.section}>
				<div className={styles.sectionHeader}>
					<h1>ECONOMY</h1>
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
		</main>
	);
}
