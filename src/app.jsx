import React, { useState, useEffect } from "react";
import "./app.css";

import {
	NavLink,
	Link,
	Route,
	Routes,
	useNavigate,
	useLocation,
} from "react-router-dom";
import { Login } from "./login/login.jsx";
import { Signup } from "./signup/signup.jsx";
import { MatchMode1 } from "./match-modes/match-mode-1/match-mode-1.jsx";
import { MatchMode2 } from "./match-modes/match-mode-2/match-mode-2.jsx";
import { MatchMode3 } from "./match-modes/match-mode-3/match-mode-3.jsx";
import { Store } from "./store/store.jsx";
import { Messages } from "./messages/messages.jsx";
import { Message } from "./messages/message/message.jsx";
import { Notifications } from "./notifications/notifications.jsx";
import { ProfileView } from "./profile-view/profile-view.jsx";

export default function App() {
	const [user, setUser] = useState(localStorage.getItem("user") || "");
	const navigate = useNavigate();
	const location = useLocation();

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
		} else {
			navigate("/match-mode-1");
		}
	}, [user, navigate, location.pathname]);

	const nextModeMap = {
		"/match-mode-1": "/match-mode-2",
		"/match-mode-2": "/match-mode-3",
		"/match-mode-3": "/match-mode-1",
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

					<Link to="/match-mode-1" id="logo">
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
				<Route path="/match-mode-1" element={<MatchMode1 />} />
				<Route path="/match-mode-2" element={<MatchMode2 />} />
				<Route path="/match-mode-3" element={<MatchMode3 />} />
				<Route path="/messages" element={<Messages />} />
				<Route path="/message" element={<Message />} />
				<Route path="/store" element={<Store />} />
				<Route path="/notifications" element={<Notifications />} />
				<Route path="/profile-view" element={<ProfileView />} />
				<Route path="*" element={<NotFound />} />
			</Routes>

			{user && showGlobalFooter && (
				<footer>
					<NavLink to="/match-mode-1">
						<i className="fa-solid fa-home"></i>
					</NavLink>

					<NavLink to="/messages">
						<i className="fa-solid fa-message"></i>
					</NavLink>

					{location.pathname.includes("match-mode") && (
						<NavLink
							className="btn"
							to={nextModeMap[location.pathname]}
						>
							<span>Pair</span>
							<span>+5</span>
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
