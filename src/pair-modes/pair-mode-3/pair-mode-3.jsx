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

	const [maleUsers, setMaleUsers] = useState([
		{
			id: "m1",
			firstName: "Michael",
			lastName: "Smith",
			birthday: "1990-04-12",
			gender: "Male",
			bio: "Just a regular guy enjoying life.",
			interests: "Sports, Grilling, Music",
			pfp1: {},
			pfp2: {},
			pfp3: {},
			pfp4: {},
			isBig: false,
		},
	]);

	const [femaleUsers, setFemaleUsers] = useState([
		{
			id: "f1",
			firstName: "Sarah",
			lastName: "Adams",
			birthday: "1993-02-14",
			gender: "Female",
			bio: "Coffee lover and weekend hiker.",
			interests: "Hiking, Coffee, Reading",
			pfp1: {},
			pfp2: {},
			pfp3: {},
			pfp4: {},
			isBig: false,
		},
		{
			id: "f2",
			firstName: "Jessica",
			lastName: "Miller",
			birthday: "1991-08-25",
			gender: "Female",
			bio: "Design enthusiast and plant mom.",
			interests: "Plants, Art, Design",
			pfp1: {},
			pfp2: {},
			pfp3: {},
			pfp4: {},
			isBig: true,
		},
		{
			id: "f3",
			firstName: "Emily",
			lastName: "Davis",
			birthday: "1996-11-03",
			gender: "Female",
			bio: "Always down for live music and tacos.",
			interests: "Concerts, Tacos, Yoga",
			pfp1: {},
			pfp2: {},
			pfp3: {},
			pfp4: {},
			isBig: false,
		},
		{
			id: "f4",
			firstName: "Ashley",
			lastName: "Clark",
			birthday: "1994-05-19",
			gender: "Female",
			bio: "Aspiring writer and foodie.",
			interests: "Writing, Baking, Travel",
			pfp1: {},
			pfp2: {},
			pfp3: {},
			pfp4: {},
			isBig: false,
		},
		{
			id: "f5",
			firstName: "Brittany",
			lastName: "Lewis",
			birthday: "1998-01-30",
			gender: "Female",
			bio: "Fitness fanatic and beach lover.",
			interests: "Fitness, Beach, Running",
			pfp1: {},
			pfp2: {},
			pfp3: {},
			pfp4: {},
			isBig: false,
		},
		{
			id: "f6",
			firstName: "Amanda",
			lastName: "Hall",
			birthday: "1995-07-11",
			gender: "Female",
			bio: "Tech nerd and board game addict.",
			interests: "Board Games, Coding, Sci-Fi",
			pfp1: {},
			pfp2: {},
			pfp3: {},
			pfp4: {},
			isBig: false,
		},
		{
			id: "f7",
			firstName: "Megan",
			lastName: "Allen",
			birthday: "1999-09-04",
			gender: "Female",
			bio: "Capturing moments through a lens.",
			interests: "Photography, Film, Camping",
			pfp1: {},
			pfp2: {},
			pfp3: {},
			pfp4: {},
			isBig: false,
		},
		{
			id: "f8",
			firstName: "Taylor",
			lastName: "Wright",
			birthday: "1992-12-18",
			gender: "Female",
			bio: "Always planning the next big trip.",
			interests: "Travel, Languages, History",
			pfp1: {},
			pfp2: {},
			pfp3: {},
			pfp4: {},
			isBig: false,
		},
		{
			id: "f9",
			firstName: "Rachel",
			lastName: "Scott",
			birthday: "1997-03-27",
			gender: "Female",
			bio: "Dog person and thrift store hunter.",
			interests: "Thrifting, Dogs, Painting",
			pfp1: {},
			pfp2: {},
			pfp3: {},
			pfp4: {},
			isBig: false,
		},
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
						state={{ user: maleUsers[0] }}
						className={`${styles.square} ${styles.big}`}
						draggable={false}
					>
						<img
							src={`/pfp-${maleUsers[0].gender.toLowerCase()}.png`}
							alt={`${maleUsers[0].firstName} ${maleUsers[0].lastName}`}
							draggable={false}
						/>
						<h3>
							{`${maleUsers[0].firstName} ${maleUsers[0].lastName}`.toUpperCase()}
						</h3>
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
							src={`/pfp-${draggingData.user.gender.toLowerCase()}.png`}
							alt={`${draggingData.user.firstName} ${draggingData.user.lastName}`}
							draggable={false}
						/>
						<h3>{draggingData.user.firstName.toUpperCase()}</h3>
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

	const displayName = isBig
		? `${user.firstName} ${user.lastName}`.toUpperCase()
		: user.firstName.toUpperCase();

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
			state={{ user }}
			ref={setNodeRef}
			className={classNames}
			draggable={false}
			{...listeners}
			{...attributes}
		>
			<img
				src={`/pfp-${user.gender.toLowerCase()}.png`}
				alt={`${user.firstName} ${user.lastName}`}
				draggable={false}
			/>
			<h3>{displayName}</h3>
		</Link>
	);
}
