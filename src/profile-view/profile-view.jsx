import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./profile-view.module.css";

export function ProfileView({ user, setUser }) {
	const navigate = useNavigate();
	const location = useLocation();

	const stateUser = location.state?.user;

	const isMyProfile =
		!stateUser ||
		(user &&
			(stateUser.email === user.email ||
				stateUser.id === user.id ||
				stateUser._id === user._id));

	const activeProfile = isMyProfile ? user || stateUser : stateUser;

	const [profileData, setProfileData] = useState(activeProfile);
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({
		firstName: activeProfile?.firstName || "",
		lastName: activeProfile?.lastName || "",
		bio: activeProfile?.bio || "",
		interests: activeProfile?.interests || "",
	});

	useEffect(() => {
		if (isMyProfile && user) {
			setProfileData(user);
			setFormData({
				firstName: user.firstName || "",
				lastName: user.lastName || "",
				bio: user.bio || "",
				interests: user.interests || "",
			});
		}
	}, [user, isMyProfile]);

	useEffect(() => {
		document.title =
			(profileData
				? `${profileData.firstName} ${profileData.lastName}`
				: "Profile") + " | Proxy Dating";
	}, [profileData]);

	const handleSave = async () => {
		try {
			const res = await fetch("/api/updateProfile", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});
			if (res.ok) {
				const updatedUser = await res.json();
				setUser(updatedUser);
				setProfileData(updatedUser);
				setIsEditing(false);
			}
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<>
			<header className={styles.header}>
				<button
					onClick={() => navigate(-1)}
					className={styles.closeBtn}
				>
					<i className="fa-solid fa-xmark"></i>
				</button>
				{isMyProfile && (
					<button
						onClick={
							isEditing ? handleSave : () => setIsEditing(true)
						}
						className={isEditing ? styles.saveBtn : styles.editBtn}
					>
						{isEditing ? "Save" : "Edit"}
					</button>
				)}
			</header>
			<main className={styles.main}>
				<section className={styles.imageSection}>
					<div className={styles.row}>
						<img
							src={`/pfp-${
								profileData
									? profileData.gender?.toLowerCase()
									: "male"
							}.png`}
							alt="Profile 1"
							className={styles.image}
						/>
						<img
							src={`/pfp-${
								profileData
									? profileData.gender?.toLowerCase()
									: "male"
							}.png`}
							alt="Profile 2"
							className={styles.image}
						/>
					</div>
					<div className={styles.row}>
						<img
							src={`/pfp-${
								profileData
									? profileData.gender?.toLowerCase()
									: "male"
							}.png`}
							alt="Profile 3"
							className={styles.image}
						/>
						<img
							src={`/pfp-${
								profileData
									? profileData.gender?.toLowerCase()
									: "male"
							}.png`}
							alt="Profile 4"
							className={styles.image}
						/>
					</div>
				</section>

				<section className={styles.infoSection}>
					{isEditing ? (
						<div className={styles.editFormContainer}>
							<div className={styles.editNameRow}>
								<input
									type="text"
									value={formData.firstName}
									onChange={(e) =>
										setFormData({
											...formData,
											firstName: e.target.value,
										})
									}
									placeholder="First Name"
									className={styles.editInput}
								/>
								<input
									type="text"
									value={formData.lastName}
									onChange={(e) =>
										setFormData({
											...formData,
											lastName: e.target.value,
										})
									}
									placeholder="Last Name"
									className={styles.editInput}
								/>
							</div>
							<textarea
								value={formData.bio}
								onChange={(e) =>
									setFormData({
										...formData,
										bio: e.target.value,
									})
								}
								placeholder="Bio"
								className={styles.editTextarea}
							/>
							<input
								type="text"
								value={formData.interests}
								onChange={(e) =>
									setFormData({
										...formData,
										interests: e.target.value,
									})
								}
								placeholder="Interests"
								className={styles.editInput}
							/>
						</div>
					) : (
						<>
							<h2 className={styles.name}>
								{profileData
									? `${profileData.firstName} ${profileData.lastName}`
									: "Name"}
							</h2>
							<p className={styles.bio}>
								{profileData ? profileData.bio : "Bio"}
							</p>
							<h3 className={styles.tags}>
								{profileData
									? profileData.interests
									: "Interests"}
							</h3>
						</>
					)}
				</section>
			</main>
		</>
	);
}
