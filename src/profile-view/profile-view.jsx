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
		birthday: activeProfile?.birthday || "",
	});

	const [newFiles, setNewFiles] = useState({});
	const [previewPics, setPreviewPics] = useState(
		activeProfile?.profilePics ? [...activeProfile.profilePics] : [],
	);

	useEffect(() => {
		if (isMyProfile && user) {
			setProfileData(user);
			setFormData({
				firstName: user.firstName || "",
				lastName: user.lastName || "",
				bio: user.bio || "",
				interests: user.interests || "",
				birthday: user.birthday || "",
			});
			setPreviewPics(user.profilePics ? [...user.profilePics] : []);
		}
	}, [user, isMyProfile]);

	useEffect(() => {
		document.title =
			(profileData
				? `${profileData.firstName} ${profileData.lastName}`
				: "Profile") + " | Proxy Dating";
	}, [profileData]);

	const calculateAge = (birthday) => {
		if (!birthday) return "";
		const birthDate = new Date(birthday);
		const today = new Date();
		let age = today.getFullYear() - birthDate.getFullYear();
		const m = today.getMonth() - birthDate.getMonth();
		if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
			age--;
		}
		return age;
	};

	const handleImageChange = (index, e) => {
		const file = e.target.files[0];
		if (!file) return;

		setNewFiles((prev) => ({ ...prev, [index]: file }));

		const objectUrl = URL.createObjectURL(file);
		const newPreviews = [...previewPics];
		newPreviews[index] = objectUrl;
		setPreviewPics(newPreviews);
	};

	const handleSave = async () => {
		try {
			const submitData = new FormData();
			submitData.append("firstName", formData.firstName);
			submitData.append("lastName", formData.lastName);
			submitData.append("bio", formData.bio);
			submitData.append("interests", formData.interests);
			submitData.append("birthday", formData.birthday);

			Object.keys(newFiles).forEach((index) => {
				submitData.append(`pic_${index}`, newFiles[index]);
			});

			const res = await fetch("/api/updateProfile", {
				method: "PUT",
				body: submitData,
			});

			if (res.ok) {
				const updatedUser = await res.json();
				setUser(updatedUser);
				setProfileData(updatedUser);
				setIsEditing(false);
				setNewFiles({});
			}
		} catch (err) {
			console.error(err);
		}
	};

	const renderImageSlot = (index) => {
		const src =
			previewPics[index] ||
			`/pfp-${profileData?.gender?.toLowerCase() || "male"}.png`;
		return (
			<div key={index} className={styles.imageContainer}>
				<img
					src={src}
					alt={`Profile ${index + 1}`}
					className={styles.image}
				/>

				{isEditing && isMyProfile && (
					<label
						className={styles.imageUploadLabel}
						title="Change Picture"
					>
						<i className="fa-solid fa-camera"></i>
						<input
							type="file"
							accept="image/png, image/jpeg, image/webp"
							onChange={(e) => handleImageChange(index, e)}
							style={{ display: "none" }}
						/>
					</label>
				)}
			</div>
		);
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
						{renderImageSlot(0)}
						{renderImageSlot(1)}
					</div>
					<div className={styles.row}>
						{renderImageSlot(2)}
						{renderImageSlot(3)}
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

							<label className={styles.editLabel}>Birthday</label>
							<input
								type="date"
								value={formData.birthday}
								onChange={(e) =>
									setFormData({
										...formData,
										birthday: e.target.value,
									})
								}
								className={styles.editInput}
							/>

							<label className={styles.editLabel}>Bio</label>
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

							<label className={styles.editLabel}>
								Interests
							</label>
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
									? `${profileData.firstName} ${profileData.lastName}, ${calculateAge(profileData.birthday)}`
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
