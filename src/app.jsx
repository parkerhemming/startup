import React, { useState, useEffect } from "react";
import "./app.css";
import "../global.css";
import { getCoins, updateCoins } from "./utils";

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
	const [user, setUser] = useState(localStorage.getItem("user") || "");
	const navigate = useNavigate();
	const location = useLocation();
	const [searchParams] = useSearchParams();
	const mode = searchParams.get("mode");

	const publicRoutes = ["/login", "/signup"];
	const hideGlobalHeaderRoutes = [
		"/messages",
		"/message",
		"/notifications",
		"/profile-view",
	];
	const hideGlobalFooterRoutes = [
		"/message",
		"/notifications",
		"/profile-view",
	];

	useEffect(() => {
		if (!user && !publicRoutes.includes(location.pathname)) {
			navigate("/login");
		} else if (location.pathname === "/") {
			navigate("/pair-mode-1");
		}
	}, [user, navigate, location.pathname]);

	const nextModeMap = {
		"/pair-mode-1": "/pair-mode-2",
		"/pair-mode-2": "/pair-mode-3",
		"/pair-mode-3": "/pair-mode-1",
	};

	const showGlobalHeader =
		!hideGlobalHeaderRoutes.includes(location.pathname) &&
		!publicRoutes.includes(location.pathname);

	const showGlobalFooter =
		!hideGlobalFooterRoutes.includes(location.pathname) &&
		!publicRoutes.includes(location.pathname);

	return (
		<div className="body">
			{showGlobalHeader && (
				<header>
					{user && (
						<button
							className="btn"
							onClick={() => {
								localStorage.removeItem("user");
								setUser("");
							}}
						>
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
						<Link to="/notifications">
							<i className="fa-solid fa-bell"></i>
						</Link>
					)}
				</header>
			)}

			<Routes>
				<Route path="/login" element={<Login setUser={setUser} />} />
				<Route path="/signup" element={<Signup setUser={setUser} />} />
				<Route path="/pair-mode-1" element={<PairMode1 />} />
				<Route path="/pair-mode-2" element={<PairMode2 />} />
				<Route path="/pair-mode-3" element={<PairMode3 />} />
				<Route path="/messages" element={<Messages />} />
				<Route path="/message" element={<Message />} />
				<Route path="/store" element={<Store />} />
				<Route path="/notifications" element={<Notifications />} />
				<Route path="/profile-view" element={<ProfileView />} />
				<Route path="*" element={<NotFound />} />
			</Routes>

			{user && showGlobalFooter && (
				<footer>
					<NavLink to="/pair-mode-1">
						<i className="fa-solid fa-home"></i>
					</NavLink>

					<NavLink to="/messages">
						<i className="fa-solid fa-message"></i>
					</NavLink>

					{location.pathname.includes("pair-mode") && (
						<NavLink
							className="btn"
							onClick={() => {
								if (mode === "me" && getCoins() >= 30) {
									updateCoins(-30);
								} else {
									updateCoins(5);
								}
							}}
							to={
								mode === "me" && getCoins() >= 30
									? "/store"
									: nextModeMap[location.pathname]
							}
						>
							{mode === "me" && getCoins() >= 30 ? (
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
					<NavLink to="/profile-view">
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
