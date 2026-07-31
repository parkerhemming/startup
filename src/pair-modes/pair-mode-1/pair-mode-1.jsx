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

export function PairMode1({ setUser, setCurrentPairs }) {
	const [draggingData, setDraggingData] = useState(null);
	const [maleUsers, setMaleUsers] = useState([]);
	const [femaleUsers, setFemaleUsers] = useState([]);

	useEffect(() => {
		async function fetchProfiles() {
			try {
				const [maleRes, femaleRes] = await Promise.all([
					fetch("/api/profiles?gender=Male&limit=9"),
					fetch("/api/profiles?gender=Female&limit=9"),
				]);

				if (maleRes.ok && femaleRes.ok) {
					const males = await maleRes.json();
					const females = await femaleRes.json();

					const mappedMales = males.map((u, index) => ({
						...u,
						isBig: index === 5,
					}));

					const mappedFemales = females.map((u, index) => ({
						...u,
						isBig: index === 1,
					}));

					setMaleUsers(mappedMales);
					setFemaleUsers(mappedFemales);
				}
			} catch (error) {
				console.error(error);
			}
		}

		fetchProfiles();
	}, []);

	useEffect(() => {
		const bigMale = maleUsers.find((u) => u.isBig);
		const bigFemale = femaleUsers.find((u) => u.isBig);
		if (bigMale && bigFemale && setCurrentPairs) {
			setCurrentPairs([[bigMale, bigFemale]]);
		}
	}, [maleUsers, femaleUsers, setCurrentPairs]);

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
					{maleUsers.map((u) => (
						<ProfileSquare
							key={u.id}
							user={u}
							gender="male"
							draggingData={draggingData}
						/>
					))}
				</section>

				<section className={styles.gridSection} id="female">
					{femaleUsers.map((u) => (
						<ProfileSquare
							key={u.id}
							user={u}
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
							src={`/pfp-${draggingData.user?.gender?.toLowerCase() || "male"}.png`}
							alt={`${draggingData.user?.firstName} ${draggingData.user?.lastName}`}
							draggable={false}
						/>
						<h3>{draggingData.user?.firstName?.toUpperCase()}</h3>
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
			state={{ user }}
			ref={setNodeRef}
			className={classNames}
			draggable={false}
			{...listeners}
			{...attributes}
		>
			<img
				src={`/pfp-${user.gender?.toLowerCase() || "male"}.png`}
				alt={`${user.firstName} ${user.lastName}`}
				draggable={false}
			/>
			<h3>
				{user.isBig
					? `${user.firstName.toUpperCase()} ${user.lastName.toUpperCase()}`
					: user.firstName.toUpperCase()}
			</h3>
		</Link>
	);
}
