import React from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./login.module.css";

export function Login({ setUser }) {
	const navigate = useNavigate();

	function login(event) {
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

			<main className={styles.loginMain}>
				<section className={styles.authContainer}>
					<div className={styles.loginBox}>
						<form onSubmit={login}>
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
