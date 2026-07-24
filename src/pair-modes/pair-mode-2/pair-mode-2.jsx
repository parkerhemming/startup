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
		{
			id: "m2",
			firstName: "Chris",
			lastName: "Evans",
			birthday: "1981-06-13",
			gender: "Male",
			bio: "Just a guy who loves movies.",
			interests: "Acting, Fitness, Dogs",
			pfp1: {},
			pfp2: {},
			pfp3: {},
			pfp4: {},
			isBig: false,
		},
		{
			id: "m3",
			firstName: "David",
			lastName: "Jones",
			birthday: "1995-03-21",
			gender: "Male",
			bio: "Always looking for the next adventure.",
			interests: "Camping, Photography",
			pfp1: {},
			pfp2: {},
			pfp3: {},
			pfp4: {},
			isBig: false,
		},
		{
			id: "m4",
			firstName: "Daniel",
			lastName: "Brown",
			birthday: "1998-11-05",
			gender: "Male",
			bio: "Coffee enthusiast and coder.",
			interests: "Programming, Coffee, Sci-Fi",
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
			<h3>{user.firstName.toUpperCase()}</h3>
		</Link>
	);
}
