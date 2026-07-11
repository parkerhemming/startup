import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./pair-mode-3.module.css";
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

export function PairMode3() {
	const [draggingData, setDraggingData] = useState(null);

	const [femaleUsers, setFemaleUsers] = useState([
		{ id: "f1", name: "SARAH ADAMS", image: "/pfp-female.png" },
		{ id: "f2", name: "JESSICA MILLER", image: "/pfp-female.png" },
		{ id: "f3", name: "EMILY DAVIS", image: "/pfp-female.png" },
		{ id: "f4", name: "ASHLEY CLARK", image: "/pfp-female.png" },
		{ id: "f5", name: "BRITTANY WRIGHT", image: "/pfp-female.png" },
		{ id: "f6", name: "AMANDA HALL", image: "/pfp-female.png" },
		{ id: "f7", name: "MEGAN YOUNG", image: "/pfp-female.png" },
		{ id: "f8", name: "TAYLOR KING", image: "/pfp-female.png" },
		{ id: "f9", name: "RACHEL SCOTT", image: "/pfp-female.png" },
	]);

	function handleSwap(draggedId, targetId) {
		setFemaleUsers((prev) => {
			const newArray = [...prev];
			const dragIndex = newArray.findIndex((u) => u.id === draggedId);
			const dropIndex = newArray.findIndex((u) => u.id === targetId);

			if (dragIndex === -1 || dropIndex === -1) return prev;

			const temp = newArray[dragIndex];
			newArray[dragIndex] = newArray[dropIndex];
			newArray[dropIndex] = temp;

			return newArray;
		});
	}

	useEffect(() => {
		document.title = `Pair | Proxy Dating`;
	}, []);

	return (
		<main className={styles.matchMain} data-dragging={!!draggingData}>
			{draggingData && <div className={styles.overlay}></div>}

			<section className={styles.maleSection}>
				<div className={`${styles.square} ${styles.big}`}>
					<img
						src="/pfp-male.png"
						alt="RYAN CARTER"
						draggable={false}
					/>
					<h3>RYAN CARTER</h3>
				</div>
			</section>

			<section className={styles.gridSection}>
				{femaleUsers.map((user, index) => (
					<ProfileSquare
						key={index}
						user={user}
						isBig={index === 1}
						onSwap={handleSwap}
						draggingData={draggingData}
						setDraggingData={setDraggingData}
					/>
				))}
			</section>
		</main>
	);
}

function ProfileSquare({ user, isBig, onSwap, draggingData, setDraggingData }) {
	const [isDragOver, setIsDragOver] = useState(false);

	const isCurrentlyDragging = draggingData?.id === user.id;

	const isValidTarget = draggingData && isBig && draggingData.id !== user.id;

	const displayName = isBig ? user.name : user.name.split(" ")[0];

	function handleDragStart(e) {
		if (isBig) {
			e.preventDefault();
			return;
		}
		e.dataTransfer.setData("draggedId", user.id);
		setTimeout(() => {
			setDraggingData({ id: user.id });
		}, 0);
	}

	function handleDragEnd() {
		setDraggingData(null);
		setIsDragOver(false);
	}

	function handleDragOver(e) {
		if (isValidTarget) {
			e.preventDefault();
			if (!isDragOver) setIsDragOver(true);
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
		if (isValidTarget && draggedId !== user.id) {
			onSwap(draggedId, user.id);
		}
	}

	const classNames = [
		styles.square,
		isBig ? styles.big : "",
		isCurrentlyDragging ? styles.isDragging : "",
		isValidTarget ? styles.highlightTarget : "",
		isDragOver ? styles.dragOver : "",
	]
		.filter(Boolean)
		.join(" ");

	return (
		<div
			className={classNames}
			draggable={!isBig}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
			onDragOver={handleDragOver}
			onDragEnter={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
		>
			<img src={user.image} alt={user.name} draggable={false} />
			<h3>{displayName}</h3>
		</div>
	);
}
