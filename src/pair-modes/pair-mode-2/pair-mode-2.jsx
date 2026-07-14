import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./pair-mode-2.module.css";
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
			gender: active.data.current.gender,
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
			const draggedGender = active.data.current?.gender;
			const targetGender = over.data.current?.gender;

			if (draggedGender === targetGender && draggedId !== targetId) {
				handleSwap(draggedId, targetId, draggedGender);
			}
		}
	}

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
		<DndContext
			sensors={sensors}
			collisionDetection={pointerWithin}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
		>
			<main className={styles.matchMain} data-dragging={!!draggingData}>
				{draggingData && <div className={styles.overlay}></div>}

				<section className={styles.containerSection}>
					{[0, 1, 2, 3].map((i) => (
						<div className={styles.row} key={i}>
							<ProfileSquare
								user={maleUsers[i]}
								gender="male"
								draggingData={draggingData}
							/>
							<hr />
							<ProfileSquare
								user={femaleUsers[i]}
								gender="female"
								draggingData={draggingData}
							/>
						</div>
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
								: "120px",
							height: draggingData.height
								? `${draggingData.height}px`
								: "120px",
							margin: 0,
							opacity: 0.9,
						}}
					>
						<img
							src={draggingData.user.image}
							alt={draggingData.user.name}
							draggable={false}
						/>
						<h3>{draggingData.user.name}</h3>
					</div>
				) : null}
			</DragOverlay>
		</DndContext>
	);
}

function ProfileSquare({ user, gender, draggingData }) {
	const {
		attributes,
		listeners,
		setNodeRef: setDraggableRef,
		isDragging,
	} = useDraggable({
		id: user.id,
		data: { user, gender },
	});
	const { setNodeRef: setDroppableRef, isOver } = useDroppable({
		id: user.id,
		data: { user, gender },
	});
	const setNodeRef = (node) => {
		setDraggableRef(node);
		setDroppableRef(node);
	};
	const isValidTarget =
		draggingData &&
		draggingData.gender === gender &&
		draggingData.user.id !== user.id;

	const validIsOver = isOver && isValidTarget;

	const classNames = [
		styles.square,
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
			<h3>{user.name}</h3>
		</Link>
	);
}
