import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./profile-view.module.css";

export function ProfileView() {
	const navigate = useNavigate();
	const location = useLocation();
	const profileData = location.state?.user;

	useEffect(() => {
		document.title =
			(profileData
				? `${profileData.firstName} ${profileData.lastName}`
				: "Profile") + " | Proxy Dating";
	}, []);

	return (
		<>
			<header className={styles.header}>
				<button
					onClick={() => navigate(-1)}
					className={styles.closeBtn}
				>
					<i className="fa-solid fa-xmark"></i>
				</button>
			</header>
			<main className={styles.main}>
				<section className={styles.imageSection}>
					<div className={styles.row}>
						<img
							src={`/pfp-${profileData ? profileData.gender.toLowerCase() : "male"}.png`}
							alt="Profile 1"
							className={styles.image}
						/>
						<img
							src={`/pfp-${profileData ? profileData.gender.toLowerCase() : "male"}.png`}
							alt="Profile 2"
							className={styles.image}
						/>
					</div>
					<div className={styles.row}>
						<img
							src={`/pfp-${profileData ? profileData.gender.toLowerCase() : "male"}.png`}
							alt="Profile 3"
							className={styles.image}
						/>
						<img
							src={`/pfp-${profileData ? profileData.gender.toLowerCase() : "male"}.png`}
							alt="Profile 4"
							className={styles.image}
						/>
					</div>
				</section>

				<section className={styles.infoSection}>
					<h2 className={styles.name}>
						{profileData
							? `${profileData.firstName} ${profileData.lastName}`
							: "Name"}
					</h2>
					<p className={styles.bio}>
						{profileData ? profileData.bio : "Bio"}
					</p>
					<h3 className={styles.tags}>
						{profileData ? profileData.interests : "Interests"}
					</h3>
				</section>
			</main>
		</>
	);
}
