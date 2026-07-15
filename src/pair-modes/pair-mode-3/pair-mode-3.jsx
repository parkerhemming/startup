import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./pair-mode-3.module.css";
import {
	DndContext,
	PointerSensor,
	useSensor,
	useSensors,
	DragOverlay,
	useDraggable,
	useDroppable,
	pointerWithin,
} from "@dnd-kit/core";

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

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 5,
			},
		}),
	);

	function handleDragStart(event) {
		const { active } = event;
		const rect = active.rect.current?.initial;

		setDraggingData({
			user: active.data.current.user,
			width: rect?.width,
			height: rect?.height,
		});
	}

	function handleDragEnd(event) {
		const { active, over } = event;
		setDraggingData(null);

		if (over) {
			const draggedId = active.id;
			const targetId = over.id;
			const targetIsBig = over.data.current?.isBig;

			if (targetIsBig && draggedId !== targetId) {
				handleSwap(draggedId, targetId);
			}
		}
	}

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
		<DndContext
			sensors={sensors}
			collisionDetection={pointerWithin}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
		>
			<main className={styles.matchMain} data-dragging={!!draggingData}>
				{draggingData && <div className={styles.overlay}></div>}

				<section className={styles.maleSection}>
					<Link
						to="/profile-view"
						className={`${styles.square} ${styles.big}`}
						draggable={false}
					>
						<img
							src="/pfp-male.png"
							alt="RYAN CARTER"
							draggable={false}
						/>
						<h3>RYAN CARTER</h3>
					</Link>
				</section>

				<section className={styles.gridSection}>
					{femaleUsers.map((user, index) => (
						<ProfileSquare
							key={user.id}
							user={user}
							isBig={index === 1}
							draggingData={draggingData}
						/>
					))}
				</section>
			</main>
			<DragOverlay dropAnimation={null}>
				{draggingData ? (
					<div
						className={styles.square}
						style={{
							width: draggingData.width
								? `${draggingData.width}px`
								: "110px",
							height: draggingData.height
								? `${draggingData.height}px`
								: "110px",
							margin: 0,
							opacity: 0.9,
						}}
					>
						<img
							src={draggingData.user.image}
							alt={draggingData.user.name}
							draggable={false}
						/>
						<h3>{draggingData.user.name.split(" ")[0]}</h3>
					</div>
				) : null}
			</DragOverlay>
		</DndContext>
	);
}

function ProfileSquare({ user, isBig, draggingData }) {
	const {
		attributes,
		listeners,
		setNodeRef: setDraggableRef,
		isDragging,
	} = useDraggable({
		id: user.id,
		data: { user, isBig },
		disabled: isBig,
	});

	const { setNodeRef: setDroppableRef, isOver } = useDroppable({
		id: user.id,
		data: { user, isBig },
		disabled: !isBig,
	});

	const setNodeRef = (node) => {
		setDraggableRef(node);
		setDroppableRef(node);
	};

	const isValidTarget =
		draggingData && isBig && draggingData.user.id !== user.id;
	const validIsOver = isOver && isValidTarget;
	const displayName = isBig ? user.name : user.name.split(" ")[0];

	const classNames = [
		styles.square,
		isBig ? styles.big : "",
		isDragging ? styles.isDragging : "",
		isValidTarget && !isDragging ? styles.highlightTarget : "",
		validIsOver ? styles.dragOver : "",
	]
		.filter(Boolean)
		.join(" ");

	return (
		<Link
			to="/profile-view"
			ref={setNodeRef}
			className={classNames}
			draggable={false}
			{...listeners}
			{...attributes}
		>
			<img src={user.image} alt={user.name} draggable={false} />
			<h3>{displayName}</h3>
		</Link>
	);
}
