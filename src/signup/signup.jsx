import React, { useEffect, useState } from "react";
import styles from "./signup.module.css";
import { Link, useNavigate } from "react-router-dom";

export function Signup({ setUser }) {
	const [showError, setShowError] = useState(false);
	const navigate = useNavigate();

	async function handleSignup(event) {
		event.preventDefault();
		const formData = new FormData(event.target);
		const userData = {
			firstName: formData.get("firstName"),
			lastName: formData.get("lastName"),
			birthday: formData.get("birthday"),
			gender: formData.get("gender"),
			email: formData.get("email"),
			password: formData.get("password"),
			bio: formData.get("bio"),
			interests: formData.get("interests"),
			pfp1: formData.get("pfp1"),
			pfp2: formData.get("pfp2"),
			pfp3: formData.get("pfp3"),
			pfp4: formData.get("pfp4"),
		};

		const response = await fetch("/api/auth/signup", {
			method: "post",
			body: JSON.stringify(userData),
			headers: {
				"Content-type": "application/json; charset=UTF-8",
			},
		});

		if (response?.status === 200) {
			const data = await response.json();
			setUser(data);
			localStorage.setItem("user", JSON.stringify(data));
			navigate("/pair-mode-1");
		} else {
			setShowError(true);

			setTimeout(() => {
				setShowError(false);
			}, 2000);
		}
	}

	useEffect(() => {
		document.title = "Signup | Proxy Dating";
	}, []);

	return (
		<div className={styles.wrapper}>
			<header className={styles.header}>
				<Link to="/pair-mode-1" id="logo">
					<i className="fa-solid fa-heart"></i>
					<h1>
						Proxy
						<br />
						Dating
					</h1>
				</Link>
			</header>
			<main className={styles.signupMain}>
				<section className={styles.authContainer}>
					<div className={styles.signupBox}>
						<form onSubmit={handleSignup}>
							<div className={styles.inputRow}>
								<div className={styles.inputGroup}>
									<label htmlFor="firstName">
										First Name
									</label>
									<input
										id="firstName"
										name="firstName"
										type="text"
									/>
								</div>
								<div className={styles.inputGroup}>
									<label htmlFor="lastName">Last Name</label>
									<input
										id="lastName"
										name="lastName"
										type="text"
									/>
								</div>
							</div>
							<div className={styles.inputRow}>
								<div className={styles.inputGroup}>
									<label htmlFor="birthday">Birthday</label>
									<input
										id="birthday"
										name="birthday"
										type="date"
									/>
								</div>
								<div className={styles.inputGroup}>
									<label htmlFor="gender">Select</label>
									<select id="gender" name="gender">
										<option>Male</option>
										<option>Female</option>
									</select>
								</div>
							</div>
							<label htmlFor="email">Email</label>
							<input id="email" name="email" type="email" />
							<label htmlFor="password">Password</label>
							<input
								id="password"
								name="password"
								type="password"
							/>
							<label htmlFor="bio">Bio</label>
							<input id="bio" name="bio" type="text" />
							<label htmlFor="interests">Interests</label>
							<input
								id="interests"
								name="interests"
								type="text"
								placeholder="e.g. Hiking, Movies"
							/>
							<label>Photos</label>
							<div className={styles.fileUploads}>
								<input
									type="file"
									id="pfp1"
									name="pfp1"
									accept="image/png, image/jpeg"
								/>
								<input
									type="file"
									id="pfp2"
									name="pfp2"
									accept="image/png, image/jpeg"
								/>
								<input
									type="file"
									id="pfp3"
									name="pfp3"
									accept="image/png, image/jpeg"
								/>
								<input
									type="file"
									id="pfp4"
									name="pfp4"
									accept="image/png, image/jpeg"
								/>
							</div>
							<input type="submit" value="Signup" />
							{showError && (
								<p className="error-text">
									Login failed, please try again.
								</p>
							)}
						</form>
						<Link className={styles.toggleBtn} to="/login">
							Already have an account? Login
						</Link>
					</div>
				</section>
			</main>
		</div>
	);
}
