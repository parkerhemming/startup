import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./pair-mode-2.module.css";
import { polyfill } from "mobile-drag-drop";
import { scrollBehaviourDragImageTranslateOverride } from "mobile-drag-drop/scroll-behaviour";
import "mobile-drag-drop/default.css";

polyfill({
	forceApply: true,
	holdToDrag: 0,
	dragImageCenterOnTouch: true,
	dragImageTranslateOverride: scrollBehaviourDragImageTranslateOverride,
});

if (typeof window !== "undefined") {
	window.addEventListener("touchmove", function () {}, { passive: false });
}

export function PairMode2() {
	const [draggingData, setDraggingData] = useState(null);

	const [maleUsers, setMaleUsers] = useState([
		{ id: "m1", name: "MICHAEL SMITH", image: "/pfp-male.png" },
		{ id: "m2", name: "CHRIS EVANS", image: "/pfp-male.png" },
		{ id: "m3", name: "DAVID JONES", image: "/pfp-male.png" },
		{ id: "m4", name: "DANIEL BROWN", image: "/pfp-male.png" },
	]);

	const [femaleUsers, setFemaleUsers] = useState([
		{ id: "f1", name: "SARAH ADAMS", image: "/pfp-female.png" },
		{ id: "f2", name: "JESSICA MILLER", image: "/pfp-female.png" },
		{ id: "f3", name: "EMILY DAVIS", image: "/pfp-female.png" },
		{ id: "f4", name: "ASHLEY CLARK", image: "/pfp-female.png" },
	]);

	function handleSwap(draggedId, targetId, gender) {
		const setUsers = gender === "male" ? setMaleUsers : setFemaleUsers;

		setUsers((prevUsers) => {
			const newArray = [...prevUsers];
			const dragIndex = newArray.findIndex((u) => u.id === draggedId);
			const dropIndex = newArray.findIndex((u) => u.id === targetId);

			if (dragIndex === -1 || dropIndex === -1) return prevUsers;

			const draggedUser = { ...newArray[dragIndex] };
			const targetUser = { ...newArray[dropIndex] };

			newArray[dragIndex] = targetUser;
			newArray[dropIndex] = draggedUser;

			return newArray;
		});
	}

	useEffect(() => {
		document.title = `Pair | Proxy Dating`;
	}, []);

	return (
		<main className={styles.matchMain} data-dragging={!!draggingData}>
			{draggingData && <div className={styles.overlay}></div>}

			<section className={styles.containerSection}>
				{[0, 1, 2, 3].map((i) => (
					<div className={styles.row} key={i}>
						<ProfileSquare
							user={maleUsers[i]}
							gender="male"
							onSwap={handleSwap}
							draggingData={draggingData}
							setDraggingData={setDraggingData}
						/>
						<hr />
						<ProfileSquare
							user={femaleUsers[i]}
							gender="female"
							onSwap={handleSwap}
							draggingData={draggingData}
							setDraggingData={setDraggingData}
						/>
					</div>
				))}
			</section>
		</main>
	);
}

function ProfileSquare({
	user,
	gender,
	onSwap,
	draggingData,
	setDraggingData,
}) {
	const [isDragOver, setIsDragOver] = useState(false);

	const isCurrentlyDragging = draggingData?.id === user.id;

	const isValidTarget =
		draggingData &&
		draggingData.gender === gender &&
		draggingData.id !== user.id;

	function handleDragStart(e) {
		e.dataTransfer.setData("draggedId", user.id);
		e.dataTransfer.setData("gender", gender);

		setTimeout(() => {
			setDraggingData({ id: user.id, gender });
		}, 0);
	}

	function handleDragEnd() {
		setDraggingData(null);
		setIsDragOver(false);
	}

	function handleDragOver(e) {
		if (isValidTarget) {
			e.preventDefault();
			setIsDragOver(true);
		}
	}

	function handleDragLeave() {
		setIsDragOver(false);
	}

	function handleDrop(e) {
		e.preventDefault();
		setIsDragOver(false);
		setDraggingData(null);

		const draggedId = e.dataTransfer.getData("draggedId");
		const draggedGender = e.dataTransfer.getData("gender");

		if (draggedGender === gender && draggedId !== user.id) {
			onSwap(draggedId, user.id, gender);
		}
	}

	const classNames = [
		styles.square,
		isCurrentlyDragging ? styles.isDragging : "",
		isValidTarget ? styles.highlightTarget : "",
		isDragOver ? styles.dragOver : "",
	]
		.filter(Boolean)
		.join(" ");

	return (
		<Link
			to="/profile-view"
			className={classNames}
			draggable={true}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
			onDragOver={handleDragOver}
			onDragEnter={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
		>
			<img src={user.image} alt={user.name} draggable={false} />
			<h3>{user.name}</h3>
		</Link>
	);
}
