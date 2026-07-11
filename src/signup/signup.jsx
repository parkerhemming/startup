import React from "react";
import styles from "./signup.module.css";
import { Link, useNavigate } from "react-router-dom";

export function Signup({ setUser }) {
	const navigate = useNavigate();

	function signup(event) {
		event.preventDefault();
		const formData = new FormData(event.target);
		const userData = {
			email: formData.get("email"),
			password: formData.get("password"),
		};
		setUser(userData);
		localStorage.setItem("user", JSON.stringify(userData));
		navigate("/match-mode-1");
	}

	return (
		<div className={styles.wrapper}>
			<header className={styles.header}>
				<Link to="/match-mode-1" id="logo">
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
						<form onSubmit={signup}>
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
									<label htmlFor="age">Age</label>
									<input id="age" name="age" type="number" />
								</div>
								<div className={styles.inputGroup}>
									<label htmlFor="gender">Select</label>
									<select id="gender" name="gender">
										<option>Boy</option>
										<option>Girl</option>
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
									id="pfp-1"
									name="pfp-1"
									accept="image/png, image/jpeg"
								/>
								<input
									type="file"
									id="pfp-2"
									name="pfp-2"
									accept="image/png, image/jpeg"
								/>
								<input
									type="file"
									id="pfp-3"
									name="pfp-3"
									accept="image/png, image/jpeg"
								/>
								<input
									type="file"
									id="pfp-4"
									name="pfp-4"
									accept="image/png, image/jpeg"
								/>
							</div>
							<input type="submit" value="Signup" />
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
