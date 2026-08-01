import React, { useEffect, useState, useRef } from "react";
import styles from "./signup.module.css";
import { Link, useNavigate } from "react-router-dom";

export function Signup({ setUser }) {
	const [showError, setShowError] = useState(false);
	const [errorMsg, setErrorMsg] = useState(
		"Signup failed, please try again.",
	);
	const navigate = useNavigate();

	const [showDatePicker, setShowDatePicker] = useState(false);
	const [birthMonth, setBirthMonth] = useState("");
	const [birthDay, setBirthDay] = useState("");
	const [birthYear, setBirthYear] = useState("");

	const today = new Date();
	const maxYear = today.getFullYear() - 18;

	const months = Array.from({ length: 12 }, (_, i) => i + 1);
	const days = Array.from({ length: 31 }, (_, i) => i + 1);
	const years = Array.from({ length: 80 }, (_, i) => maxYear - i);

	const formattedMonth = String(birthMonth).padStart(2, "0");
	const formattedDay = String(birthDay).padStart(2, "0");
	const formattedDate =
		birthYear && birthMonth && birthDay
			? `${birthYear}-${formattedMonth}-${formattedDay}`
			: "";

	async function handleSignup(event) {
		event.preventDefault();
		const form = event.target;
		const formData = new FormData(form);

		if (!formattedDate) {
			setErrorMsg("Please complete your birthday selection.");
			setShowError(true);
			setTimeout(() => setShowError(false), 3500);
			return;
		}

		const birthDateObj = new Date(formattedDate);
		let age = today.getFullYear() - birthDateObj.getFullYear();
		const m = today.getMonth() - birthDateObj.getMonth();
		if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) {
			age--;
		}

		if (age < 18) {
			setErrorMsg("You must be at least 18 years old to sign up.");
			setShowError(true);
			setTimeout(() => setShowError(false), 3500);
			return;
		}

		const pfp1 = formData.get("pfp1");
		const pfp2 = formData.get("pfp2");
		const pfp3 = formData.get("pfp3");
		const pfp4 = formData.get("pfp4");

		if (!pfp1.size || !pfp2.size || !pfp3.size || !pfp4.size) {
			setErrorMsg("Please upload all 4 photos.");
			setShowError(true);
			setTimeout(() => setShowError(false), 3000);
			return;
		}

		const uploadData = new FormData();
		uploadData.append("firstName", formData.get("firstName"));
		uploadData.append("lastName", formData.get("lastName"));
		uploadData.append("birthday", formData.get("birthday"));
		uploadData.append("gender", formData.get("gender"));
		uploadData.append("email", formData.get("email"));
		uploadData.append("password", formData.get("password"));
		uploadData.append("bio", formData.get("bio"));
		uploadData.append("interests", formData.get("interests"));
		uploadData.append("profilePics", pfp1);
		uploadData.append("profilePics", pfp2);
		uploadData.append("profilePics", pfp3);
		uploadData.append("profilePics", pfp4);

		try {
			const response = await fetch("/api/auth/signup", {
				method: "post",
				body: uploadData,
			});

			if (response?.status === 200) {
				const data = await response.json();
				setUser(data);
				localStorage.setItem("token", data.token);
				navigate("/pair-mode-1");
			} else {
				const errData = await response.json().catch(() => ({}));
				setErrorMsg(errData.msg || "Signup failed, please try again.");
				setShowError(true);

				setTimeout(() => {
					setShowError(false);
				}, 3000);
			}
		} catch (error) {
			console.error("Signup error:", error);
			setErrorMsg("Server error occurred.");
			setShowError(true);
			setTimeout(() => setShowError(false), 3000);
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
										required
									/>
								</div>
								<div className={styles.inputGroup}>
									<label htmlFor="lastName">Last Name</label>
									<input
										id="lastName"
										name="lastName"
										type="text"
										required
									/>
								</div>
							</div>

							<div className={styles.inputRow}>
								<div
									className={`${styles.inputGroup} ${styles.datePickerContainer}`}
								>
									<label>Birthday</label>
									<input
										type="hidden"
										name="birthday"
										value={formattedDate}
									/>

									<div
										className={styles.dateDisplay}
										onClick={() => setShowDatePicker(true)}
									>
										{birthMonth && birthDay && birthYear ? (
											`${formattedMonth} / ${formattedDay} / ${birthYear}`
										) : (
											<span
												className={styles.placeholder}
											>
												MM / DD / YYYY
											</span>
										)}
									</div>

									{showDatePicker && (
										<>
											<div
												className={
													styles.datePickerOverlay
												}
												onClick={() =>
													setShowDatePicker(false)
												}
											></div>
											<div
												className={
													styles.datePickerPopup
												}
											>
												<div
													className={
														styles.dateColumn
													}
												>
													<div
														className={
															styles.columnHeader
														}
													>
														Mo
													</div>
													{months.map((m) => (
														<button
															key={`mo-${m}`}
															type="button"
															className={`${styles.dateOption} ${birthMonth === m ? styles.selected : ""}`}
															onClick={() =>
																setBirthMonth(m)
															}
														>
															{String(m).padStart(
																2,
																"0",
															)}
														</button>
													))}
												</div>
												<div
													className={
														styles.dateColumn
													}
												>
													<div
														className={
															styles.columnHeader
														}
													>
														Day
													</div>
													{days.map((d) => (
														<button
															key={`day-${d}`}
															type="button"
															className={`${styles.dateOption} ${birthDay === d ? styles.selected : ""}`}
															onClick={() =>
																setBirthDay(d)
															}
														>
															{String(d).padStart(
																2,
																"0",
															)}
														</button>
													))}
												</div>
												<div
													className={
														styles.dateColumn
													}
												>
													<div
														className={
															styles.columnHeader
														}
													>
														Yr
													</div>
													{years.map((y) => (
														<button
															key={`yr-${y}`}
															type="button"
															className={`${styles.dateOption} ${birthYear === y ? styles.selected : ""}`}
															onClick={() =>
																setBirthYear(y)
															}
														>
															{y}
														</button>
													))}
												</div>
											</div>
										</>
									)}
								</div>

								<div className={styles.inputGroup}>
									<label htmlFor="gender">Select</label>
									<select id="gender" name="gender" required>
										<option>Male</option>
										<option>Female</option>
									</select>
								</div>
							</div>

							<label htmlFor="email">Email</label>
							<input
								id="email"
								name="email"
								type="email"
								required
							/>
							<label htmlFor="password">Password</label>
							<input
								id="password"
								name="password"
								type="password"
								required
							/>
							<label htmlFor="bio">Bio</label>
							<input id="bio" name="bio" type="text" required />
							<label htmlFor="interests">Interests</label>
							<input
								id="interests"
								name="interests"
								type="text"
								placeholder="e.g. Hiking, Movies"
								required
							/>
							<label>Photos (All 4 Required)</label>
							<div className={styles.fileUploads}>
								<input
									type="file"
									id="pfp1"
									name="pfp1"
									accept="image/png, image/jpeg, image/webp"
									required
								/>
								<input
									type="file"
									id="pfp2"
									name="pfp2"
									accept="image/png, image/jpeg, image/webp"
									required
								/>
								<input
									type="file"
									id="pfp3"
									name="pfp3"
									accept="image/png, image/jpeg, image/webp"
									required
								/>
								<input
									type="file"
									id="pfp4"
									name="pfp4"
									accept="image/png, image/jpeg, image/webp"
									required
								/>
							</div>
							<input type="submit" value="Signup" />
							{showError && (
								<p
									className="error-text"
									style={{
										color: "red",
										textAlign: "center",
										marginTop: "10px",
									}}
								>
									{errorMsg}
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
