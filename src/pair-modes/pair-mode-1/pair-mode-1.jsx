import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./pair-mode-1.module.css";
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

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 5,
			},
		}),
	);

	function handleDragStart(event) {
		const { active } = event;
		setDraggingData(active.data.current);
	}

	function handleDragEnd(event) {
		const { active, over } = event;
		setDraggingData(null);

		if (over) {
			const draggedId = active.id;
			const targetId = over.id;
			const draggedGender = active.data.current?.gender;
			const targetGender = over.data.current?.gender;
			const targetIsBig = over.data.current?.user?.isBig;

			if (
				draggedGender === targetGender &&
				targetIsBig &&
				draggedId !== targetId
			) {
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
		<DndContext
			sensors={sensors}
			collisionDetection={pointerWithin}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
		>
			<main className={styles.matchMain} data-dragging={!!draggingData}>
				{draggingData && <div className={styles.overlay}></div>}

				<section className={styles.gridSection} id="male">
					{maleUsers.map((user) => (
						<ProfileSquare
							key={user.id}
							user={user}
							gender="male"
							draggingData={draggingData}
						/>
					))}
				</section>

				<section className={styles.gridSection} id="female">
					{femaleUsers.map((user) => (
						<ProfileSquare
							key={user.id}
							user={user}
							gender="female"
							draggingData={draggingData}
						/>
					))}
				</section>
			</main>

			<DragOverlay dropAnimation={null}>
				{draggingData ? (
					<div className={styles.square}>
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

function ProfileSquare({ user, gender, draggingData }) {
	const {
		attributes,
		listeners,
		setNodeRef: setDraggableRef,
		isDragging,
	} = useDraggable({
		id: user.id,
		data: { user, gender },
		disabled: user.isBig,
	});

	const { setNodeRef: setDroppableRef, isOver } = useDroppable({
		id: user.id,
		data: { user, gender },
		disabled: !user.isBig,
	});

	const setNodeRef = (node) => {
		setDraggableRef(node);
		setDroppableRef(node);
	};

	const isTargetBigSquare = draggingData?.gender === gender && user.isBig;
	const validIsOver = isOver && draggingData?.gender === gender;

	const classNames = [
		styles.square,
		user.isBig ? styles.big : "",
		isDragging ? styles.isDragging : "",
		isTargetBigSquare ? styles.highlightBig : "",
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
			<h3>{user.isBig ? user.name : user.name.split(" ")[0]}</h3>
		</Link>
	);
}
