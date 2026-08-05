import React, { useState, useEffect } from "react";
import { Link, useNavigationType } from "react-router-dom";
import { Loading } from "../../shared.jsx";
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

export function PairMode2({ profileCount, setCurrentPairs }) {
	const navType = useNavigationType();
	const [draggingData, setDraggingData] = useState(null);
	const [maleUsers, setMaleUsers] = useState([]);
	const [femaleUsers, setFemaleUsers] = useState([]);

	useEffect(() => {
		async function fetchProfiles() {
			try {
				if (navType === "POP") {
					const cachedMales =
						sessionStorage.getItem("pairMode2_males");
					const cachedFemales =
						sessionStorage.getItem("pairMode2_females");
					if (cachedMales && cachedFemales) {
						setMaleUsers(JSON.parse(cachedMales));
						setFemaleUsers(JSON.parse(cachedFemales));
						return;
					}
				}

				const [maleRes, femaleRes] = await Promise.all([
					fetch("/api/profiles?gender=Male&limit=4"),
					fetch("/api/profiles?gender=Female&limit=4"),
				]);

				if (maleRes.ok && femaleRes.ok) {
					const males = await maleRes.json();
					const females = await femaleRes.json();
					setMaleUsers(males);
					setFemaleUsers(females);
				}
			} catch (error) {
				console.error(error);
			}
		}

		fetchProfiles();
	}, [navType]);

	useEffect(() => {
		if (maleUsers.length > 0) {
			sessionStorage.setItem(
				"pairMode2_males",
				JSON.stringify(maleUsers),
			);
		}
	}, [maleUsers]);

	useEffect(() => {
		if (femaleUsers.length > 0) {
			sessionStorage.setItem(
				"pairMode2_females",
				JSON.stringify(femaleUsers),
			);
		}
	}, [femaleUsers]);

	useEffect(() => {
		const pairs = [];
		const rowCount = Math.min(4, maleUsers.length, femaleUsers.length);
		for (let i = 0; i < rowCount; i++) {
			if (maleUsers[i] && femaleUsers[i]) {
				pairs.push([maleUsers[i], femaleUsers[i]]);
			}
		}
		if (setCurrentPairs) {
			setCurrentPairs(pairs);
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

	const rowCount = Math.min(4, maleUsers.length, femaleUsers.length);
	const rows = Array.from({ length: rowCount }, (_, i) => i);


	if (profileCount < 8) return <main className="centerState"><h2>You paired everyone nearby.</h2><p>There are no more profiles to pair in your area right now. Check back soon.</p></main>;

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
					{rows.map((i) => (
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

					>
						<img
							src={
								draggingData.user?.profilePics?.[0] ||
								`/pfp-${draggingData.user?.gender?.toLowerCase() || "male"}.png`
							}
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
				src={
					user?.profilePics?.[0] ||
					`/pfp-${user?.gender?.toLowerCase() || "male"}.png`
				}
				alt={`${user.firstName} ${user.lastName}`}
				draggable={false}
			/>
			<h3>{user.firstName.toUpperCase()}</h3>
		</Link>
	);
}
