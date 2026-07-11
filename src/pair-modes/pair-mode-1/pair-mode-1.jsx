import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./pair-mode-1.module.css";
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

export function PairMode1() {
	const [draggingData, setDraggingData] = useState(null);

	const [maleUsers, setMaleUsers] = useState([
		{
			id: "m1",
			name: "MICHAEL SMITH",
			isBig: false,
			image: "/pfp-male.png",
		},
		{ id: "m2", name: "CHRIS EVANS", isBig: false, image: "/pfp-male.png" },
		{ id: "m3", name: "DAVID JONES", isBig: false, image: "/pfp-male.png" },
		{
			id: "m4",
			name: "DANIEL BROWN",
			isBig: false,
			image: "/pfp-male.png",
		},
		{
			id: "m5",
			name: "JAMES WILSON",
			isBig: false,
			image: "/pfp-male.png",
		},
		{ id: "m6", name: "RYAN CARTER", isBig: true, image: "/pfp-male.png" },
		{ id: "m7", name: "TYLER MOORE", isBig: false, image: "/pfp-male.png" },
		{ id: "m8", name: "JOSH TAYLOR", isBig: false, image: "/pfp-male.png" },
		{ id: "m9", name: "ALEX WHITE", isBig: false, image: "/pfp-male.png" },
	]);

	const [femaleUsers, setFemaleUsers] = useState([
		{
			id: "f1",
			name: "SARAH ADAMS",
			isBig: false,
			image: "/pfp-female.png",
		},
		{
			id: "f2",
			name: "JESSICA MILLER",
			isBig: true,
			image: "/pfp-female.png",
		},
		{
			id: "f3",
			name: "EMILY DAVIS",
			isBig: false,
			image: "/pfp-female.png",
		},
		{
			id: "f4",
			name: "ASHLEY CLARK",
			isBig: false,
			image: "/pfp-female.png",
		},
		{
			id: "f5",
			name: "BRITTANY LEWIS",
			isBig: false,
			image: "/pfp-female.png",
		},
		{
			id: "f6",
			name: "AMANDA HALL",
			isBig: false,
			image: "/pfp-female.png",
		},
		{
			id: "f7",
			name: "MEGAN ALLEN",
			isBig: false,
			image: "/pfp-female.png",
		},
		{
			id: "f8",
			name: "TAYLOR WRIGHT",
			isBig: false,
			image: "/pfp-female.png",
		},
		{
			id: "f9",
			name: "RACHEL SCOTT",
			isBig: false,
			image: "/pfp-female.png",
		},
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

			const tempBig = draggedUser.isBig;
			draggedUser.isBig = targetUser.isBig;
			targetUser.isBig = tempBig;

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

			<section className={styles.gridSection} id="male">
				{maleUsers.map((user) => (
					<ProfileSquare
						key={user.id}
						user={user}
						gender="male"
						onSwap={handleSwap}
						draggingData={draggingData}
						setDraggingData={setDraggingData}
					/>
				))}
			</section>

			<section className={styles.gridSection} id="female">
				{femaleUsers.map((user) => (
					<ProfileSquare
						key={user.id}
						user={user}
						gender="female"
						onSwap={handleSwap}
						draggingData={draggingData}
						setDraggingData={setDraggingData}
					/>
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
		draggingData.id !== user.id &&
		(draggingData.isBig || user.isBig);

	const isTargetBigSquare =
		draggingData &&
		draggingData.gender === gender &&
		user.isBig &&
		!isCurrentlyDragging;

	function handleDragStart(e) {
		e.dataTransfer.setData("draggedId", user.id);
		e.dataTransfer.setData("gender", gender);
		e.dataTransfer.setData("isBig", user.isBig.toString());

		setTimeout(() => {
			setDraggingData({ id: user.id, gender, isBig: user.isBig });
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
		const draggedIsBig = e.dataTransfer.getData("isBig") === "true";

		if (
			draggedGender === gender &&
			draggedId !== user.id &&
			(draggedIsBig || user.isBig)
		) {
			onSwap(draggedId, user.id, gender);
		}
	}

	const classNames = [
		styles.square,
		user.isBig ? styles.big : "",
		isCurrentlyDragging ? styles.isDragging : "",
		isTargetBigSquare ? styles.highlightBig : "",
		isDragOver ? styles.dragOver : "",
	]
		.filter(Boolean)
		.join(" ");

	return (
		<Link
			to="/profile-view"
			className={classNames}
			draggable={!user.isBig}
			onDragStart={!user.isBig ? handleDragStart : undefined}
			onDragEnd={!user.isBig ? handleDragEnd : undefined}
			onDragOver={handleDragOver}
			onDragEnter={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
		>
			<img src={user.image} alt={user.name} draggable={false} />
			<h3>{user.isBig ? user.name : user.name.split(" ")[0]}</h3>
		</Link>
	);
}
