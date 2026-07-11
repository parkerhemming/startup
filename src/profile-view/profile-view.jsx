import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./profile-view.module.css";

export function ProfileView() {
	const navigate = useNavigate();

	const profileData = {
		name: "John Doe",
		bio: "Grinding out summer sales so I can spend the off-season traveling and actually enjoying my weekends. Always looking for ways to stay involved and busy when I'm not working on the doors. Big fan of hitting the gym, finding the best local food spots, and spontaneous road trips. Looking for someone who can match my energy and doesn't take life too seriously.",
		interests:
			"Traveling, Working out, Live music, Trying new restaurants, Outdoors",
		images: [
			"/pfp-male.png",
			"/pfp-male.png",
			"/pfp-male.png",
			"/pfp-male.png",
		],
	};

	useEffect(() => {
		document.title = `${profileData.name} | Proxy Dating`;
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
							src={profileData.images[0]}
							alt="Profile 1"
							className={styles.image}
						/>
						<img
							src={profileData.images[1]}
							alt="Profile 2"
							className={styles.image}
						/>
					</div>
					<div className={styles.row}>
						<img
							src={profileData.images[2]}
							alt="Profile 3"
							className={styles.image}
						/>
						<img
							src={profileData.images[3]}
							alt="Profile 4"
							className={styles.image}
						/>
					</div>
				</section>

				<section className={styles.infoSection}>
					<h2 className={styles.name}>{profileData.name}</h2>
					<p className={styles.bio}>{profileData.bio}</p>
					<h3 className={styles.tags}>{profileData.interests}</h3>
				</section>
			</main>
		</>
	);
}
