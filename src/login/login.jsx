import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./login.module.css";

export function Login({ setUser }) {
	const [showError, setShowError] = useState(false);
	const navigate = useNavigate();

	async function handleLogin(event) {
		event.preventDefault();
		const formData = new FormData(event.target);

		const userData = {
			email: formData.get("email"),
			password: formData.get("password"),
		};

		const response = await fetch("/api/auth/login", {
			method: "post",
			body: JSON.stringify(userData),
			headers: {
				"Content-type": "application/json; charset=UTF-8",
			},
		});

		if (response?.status === 200) {
			const data = await response.json();
			setUser(data.email);
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
		document.title = "Login | Proxy Dating";
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

			<main className={styles.loginMain}>
				<section className={styles.authContainer}>
					<div className={styles.loginBox}>
						<form onSubmit={handleLogin}>
							<label htmlFor="email">Email</label>
							<input
								id="email"
								name="email"
								type="email"
								placeholder="Enter your email"
							/>
							<label htmlFor="password">Password</label>
							<input
								id="password"
								name="password"
								type="password"
								placeholder="Enter your password"
							/>
							<input type="submit" value="Login" />
							{showError && (
								<p className="error-text">
									Login failed, please try again.
								</p>
							)}
						</form>
						<Link className={styles.toggleBtn} to="/signup">
							Don't have an account? Signup
						</Link>
					</div>
				</section>
			</main>
		</div>
	);
}
