import React, { useState, useEffect, useRef } from "react";
import "./app.css";
import "../global.css";
import { increment } from "./utils";

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

	const navigate = useNavigate();
	const location = useLocation();
	const [searchParams] = useSearchParams();
	const mode = searchParams.get("mode");

	const userId = user?._id || user?.id;
	const notifsCount = user?.notifications?.length || 0;
	const [seenNotifsCount, setSeenNotifsCount] = useState(0);

	useEffect(() => {
		if (userId) {
			const savedCount = parseInt(
				localStorage.getItem(`seenNotifs_${userId}`) || "0",
				10,
			);
			setSeenNotifsCount(savedCount);
		}
	}, [userId]);

	useEffect(() => {
		if (location.pathname === "/notifications" && userId) {
			setSeenNotifsCount(notifsCount);
			localStorage.setItem(
				`seenNotifs_${userId}`,
				notifsCount.toString(),
			);
		}
	}, [location.pathname, notifsCount, userId]);

	const hasUnreadNotifs = notifsCount > seenNotifsCount;

	const [unreadMatches, setUnreadMatches] = useState(new Set());

	const currentPathRef = useRef(location.pathname);
	const currentMatchRef = useRef(location.state?.user?.id);

	useEffect(() => {
		currentPathRef.current = location.pathname;
		currentMatchRef.current = location.state?.user?.id;
	}, [location]);

	useEffect(() => {
		const userId = user?._id || user?.id;
		if (!userId) return;

		const protocol = window.location.protocol === "http:" ? "ws" : "wss";
		const port =
			window.location.port === "5173" ? "4000" : window.location.port;
		const host = port
			? `${window.location.hostname}:${port}`
			: window.location.hostname;

		const ws = new WebSocket(`${protocol}://${host}`);

		ws.onopen = () => {
			ws.send(
				JSON.stringify({ type: "auth", userId: userId.toString() }),
			);
		};

		ws.onmessage = async (event) => {
			const { type, payload } = JSON.parse(event.data);

			if (type === "NEW_MESSAGE") {
				setUser((prev) => {
					const updatedMatches = [...prev.matches];
					const matchIndex = updatedMatches.findIndex(
						(m) => m.id === payload.matchId,
					);

					if (matchIndex !== -1) {
						const updatedMatch = { ...updatedMatches[matchIndex] };

						updatedMatch.messages = [
							...(updatedMatch.messages || []),
							payload.message,
						];

						updatedMatch.text = payload.text;
						updatedMatch.time = payload.time;
						updatedMatch.timestamp = payload.timestamp;

						updatedMatches.splice(matchIndex, 1);
						updatedMatches.unshift(updatedMatch);
					}
					return { ...prev, matches: updatedMatches };
				});

				const isLookingAtThisMatch =
					currentPathRef.current === "/message" &&
					currentMatchRef.current === payload.matchId;

				if (!isLookingAtThisMatch) {
					setUnreadMatches((prev) =>
						new Set(prev).add(payload.matchId),
					);
				}
			} else if (type === "COIN_UPDATE") {
				setUser((prev) => {
					const updatedUser = { ...prev, coins: payload.coins };

					if (payload.activePairs !== undefined) {
						updatedUser.activePairs = payload.activePairs;
					}

					if (payload.newNotification) {
						updatedUser.notifications = [
							payload.newNotification,
							...prev.notifications,
						];
					}
					return updatedUser;
				});
			} else if (type === "SYNC_USER") {
				const res = await fetch("/api/getUser");
				if (res.ok) setUser(await res.json());
			}
		};

		return () => ws.close();
	}, [user?._id, user?.id]);

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
	}, []);

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
						<Link
							to="/notifications"
							className={hasUnreadNotifs ? "noti-wrapper" : ""}
						>
							{hasUnreadNotifs && <div className="circle"></div>}
							<i className="fa-solid fa-bell"></i>
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
						<PairMode1
							setUser={setUser}
							setCurrentPairs={setCurrentPairs}
						/>
					}
				/>
				<Route
					path="/pair-mode-2"
					element={
						<PairMode2
							setUser={setUser}
							setCurrentPairs={setCurrentPairs}
						/>
					}
				/>
				<Route
					path="/pair-mode-3"
					element={
						<PairMode3
							setUser={setUser}
							user={user}
							setCurrentPairs={setCurrentPairs}
						/>
					}
				/>
				<Route
					path="/messages"
					element={
						<Messages
							setUser={setUser}
							user={user}
							unreadMatches={unreadMatches}
						/>
					}
				/>
				<Route
					path="/message"
					element={
						<Message
							setUser={setUser}
							user={user}
							setUnreadMatches={setUnreadMatches}
						/>
					}
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
					<NavLink to="/pair-mode-1">
						<i className="fa-solid fa-home"></i>
					</NavLink>

					<NavLink
						to="/messages"
						className={unreadMatches.size > 0 ? "noti-wrapper" : ""}
					>
						{unreadMatches.size > 0 && (
							<div className="circle"></div>
						)}
						<i className="fa-solid fa-message"></i>
					</NavLink>

					{location.pathname.includes("pair-mode") && (
						<NavLink
							className="btn"
							onClick={async (e) => {
								e.preventDefault();

								if (mode === "me" && user.coins >= 30) {
									await increment("coins", -30, setUser);
								} else if (mode !== "me") {
									await increment("coins", 5, setUser);
								}

								if (currentPairs.length > 0) {
									try {
										const res = await fetch(
											"/api/match/pair",
											{
												method: "POST",
												headers: {
													"Content-Type":
														"application/json",
												},
												body: JSON.stringify({
													pairs: currentPairs,
												}),
											},
										);
										if (res.ok) {
											const updatedUser =
												await res.json();
											setUser(updatedUser);
										}
									} catch (err) {
										console.error(err);
									}
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

					<NavLink to="/store">
						<i className="fa-solid fa-store"></i>
					</NavLink>
					<NavLink to={`/profile-view`} state={{ user }}>
						<i className="fa-solid fa-circle-user"></i>
					</NavLink>
				</footer>
			)}
		</div>
	);
}

function NotFound() {
	return <main>404 Not Found</main>;
}
