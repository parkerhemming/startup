import React, { useState, useEffect } from "react";
import "./app.css";
import "../global.css";
import {
	NavLink,
	Link,
	Route,
	Routes,
	useNavigate,
	useLocation,
	useSearchParams,
} from "react-router-dom";
import { Login } from "./login/login.jsx";
import { Signup } from "./signup/signup.jsx";
import { PairMode1 } from "./pair-modes/pair-mode-1/pair-mode-1.jsx";
import { PairMode2 } from "./pair-modes/pair-mode-2/pair-mode-2.jsx";
import { PairMode3 } from "./pair-modes/pair-mode-3/pair-mode-3.jsx";
import { Store } from "./store/store.jsx";
import { Messages } from "./messages/messages.jsx";
import { Message } from "./messages/message/message.jsx";
import { Notifications } from "./notifications/notifications.jsx";
import { ProfileView } from "./profile-view/profile-view.jsx";

export default function App() {
	const token = localStorage.getItem("token");
	const [user, setUser] = useState(null);
	const [currentPairs, setCurrentPairs] = useState([]);
	const [profileCount, setProfileCount] = useState(9);

	useEffect(() => {
		fetch("/api/getUser")
			.then((res) => {
				if (res.ok) {
					return res.json();
				}
				throw new Error("Not logged in");
			})
			.then(setUser)
			.catch(() => navigate("/login"));
		fetch("/api/profile-count").then((res) => res.ok && res.json()).then((data) => data && setProfileCount(data.count));
	}, []);

	const navigate = useNavigate();
	const location = useLocation();
	const [searchParams] = useSearchParams();
	const mode = searchParams.get("mode");

	const nextModeMap = {
		"/pair-mode-1": "/pair-mode-2",
		"/pair-mode-2": "/pair-mode-3",
		"/pair-mode-3": "/pair-mode-1",
	};

	const showHeader =
		!["/messages", "/message", "/notifications", "/profile-view"].includes(
			location.pathname,
		) && !["/login", "/signup"].includes(location.pathname);

	const showFooter =
		!["/message", "/notifications", "/profile-view"].includes(
			location.pathname,
		) && !["/login", "/signup"].includes(location.pathname);

	async function handleLogout() {
		await fetch("/api/auth/logout", {
			method: "delete",
		});

		setUser("");
		localStorage.removeItem("token");
		navigate("/login");
	}

	return (
		<div className="body">
			{showHeader && (
				<header>
					{user && (
						<button className="btn" onClick={handleLogout}>
							Logout
						</button>
					)}

					<Link to="/pair-mode-1" id="logo">
						<i className="fa-solid fa-heart"></i>
						<h1>
							Proxy
							<br />
							Dating
						</h1>
					</Link>

					{user && (
						<Link to="/notifications" className="noti-wrapper">
							<span className="iconCircle"><span className="noticeDot"></span><i className="fa-solid fa-bell"></i></span>
						</Link>
					)}
				</header>
			)}

			<Routes>
				<Route path="/login" element={<Login setUser={setUser} />} />
				<Route path="/signup" element={<Signup setUser={setUser} />} />
				<Route
					path="/pair-mode-1"
					element={
						<PairMode1 profileCount={profileCount} setCurrentPairs={setCurrentPairs} />
					}
				/>
				<Route
					path="/pair-mode-2"
					element={
						<PairMode2 profileCount={profileCount} setCurrentPairs={setCurrentPairs} />
					}
				/>
				<Route
					path="/pair-mode-3"
					element={
						<PairMode3 profileCount={profileCount} user={user} setCurrentPairs={setCurrentPairs} />
					}
				/>
				<Route
					path="/messages"
					element={<Messages setUser={setUser} user={user} />}
				/>
				<Route
					path="/message"
					element={<Message setUser={setUser} user={user} />}
				/>
				<Route
					path="/store"
					element={<Store setUser={setUser} user={user} />}
				/>
				<Route
					path="/notifications"
					element={<Notifications user={user} />}
				/>
				<Route
					path="/profile-view"
					element={<ProfileView setUser={setUser} user={user} />}
				/>
				<Route path="*" element={<NotFound />} />
			</Routes>

			{user && showFooter && (
				<footer>
					<NavLink to="/pair-mode-1" className="iconCircle"><i className="fa-solid fa-home"></i></NavLink>

					<NavLink to="/messages" className="iconCircle"><i className="fa-solid fa-message"></i></NavLink>

					{location.pathname.includes("pair-mode") && (
						<NavLink
							className="btn"
							onClick={async (e) => {
								e.preventDefault();

								if (currentPairs.length > 0) {
									const res = await fetch("/api/match/pair", {
										method: "POST",
										headers: { "Content-Type": "application/json" },
										body: JSON.stringify({ pairs: currentPairs }),
									});
									if (res.ok) setUser(await res.json());
								}

								const targetPath =
									mode === "me" && user.coins >= 30
										? "/store"
										: nextModeMap[location.pathname] ||
											"/pair-mode-1";

								navigate(
									targetPath +
										(mode === "me" ? "?mode=me" : ""),
								);
							}}
							to={
								mode === "me" && user.coins >= 30
									? "/store"
									: nextModeMap[location.pathname]
							}
						>
							{mode === "me" && user.coins >= 30 ? (
								<>
									<span>Match Me</span>
									<span style={{ color: "red" }}>-30</span>
								</>
							) : (
								<>
									<span>Pair</span>
									<span>+5</span>
								</>
							)}

							<i className="fa-solid fa-coins"></i>
						</NavLink>
					)}

					<NavLink to="/store" className="iconCircle"><i className="fa-solid fa-store"></i></NavLink>
					<NavLink to={`/profile-view`} state={{ user }} className="iconCircle"><i className="fa-solid fa-circle-user"></i></NavLink>
				</footer>
			)}
		</div>
	);
}

function NotFound() {
	return <main>404 Not Found</main>;
}
