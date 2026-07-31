import React, { useState, useEffect } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
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

export function PairMode3({ setUser, user, setCurrentPairs }) {
	const location = useLocation();
	const [searchParams] = useSearchParams();
	const isMeMode = searchParams.get("mode") === "me";
	const passedUser = location.state?.user;

	const [draggingData, setDraggingData] = useState(null);

	const loggedInGender = user?.gender;
	const targetGridGender = loggedInGender
		? loggedInGender.toLowerCase() === "female"
			? "Male"
			: "Female"
		: null;

	const [topUser, setTopUser] = useState(passedUser || null);
	const [gridUsers, setGridUsers] = useState([]);

	useEffect(() => {
		if (isMeMode && user?.id) {
			setTopUser(user);
		}
	}, [isMeMode, user]);

	useEffect(() => {
		async function fetchGridProfiles() {
			if (!targetGridGender) return;
			try {
				const response = await fetch(
					`/api/profiles?gender=${targetGridGender}&limit=9`,
				);
				if (response.ok) {
					const data = await response.json();
					setGridUsers(data);
				}
			} catch (error) {
				console.error(error);
			}
		}

		fetchGridProfiles();
	}, [targetGridGender]);

	useEffect(() => {
		async function fetchRandomTopUser() {
			if (!isMeMode && !passedUser && loggedInGender) {
				try {
					const response = await fetch(
						`/api/profiles?gender=${loggedInGender}&limit=20`,
					);
					if (response.ok) {
						const data = await response.json();
						if (data.length > 0) {
							const randomUser =
								data[Math.floor(Math.random() * data.length)];
							setTopUser(randomUser);
						}
					}
				} catch (error) {
					console.error(error);
				}
			}
		}

		fetchRandomTopUser();
	}, [isMeMode, passedUser, loggedInGender]);

	useEffect(() => {
		const bigGridUser = gridUsers.find((u, i) => i === 1);
		if (topUser && bigGridUser && setCurrentPairs) {
			setCurrentPairs([[topUser, bigGridUser]]);
		}
	}, [topUser, gridUsers, setCurrentPairs]);

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
		setGridUsers((prev) => {
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
					{topUser ? (
						<Link
							to="/profile-view"
							state={{ user: topUser }}
							className={`${styles.square} ${styles.big}`}
							draggable={false}
						>
							<img
								src={`/pfp-${topUser.gender ? topUser.gender.toLowerCase() : "male"}.png`}
								alt={`${topUser.firstName} ${topUser.lastName}`}
								draggable={false}
							/>
							<h3>
								{`${topUser.firstName || ""} ${topUser.lastName || ""}`.toUpperCase()}
							</h3>
						</Link>
					) : (
						<div className={`${styles.square} ${styles.big}`}>
							<h3>LOADING...</h3>
						</div>
					)}
				</section>

				<section className={styles.gridSection}>
					{gridUsers.map((gridUser, index) => (
						<ProfileSquare
							key={gridUser.id}
							user={gridUser}
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
							src={`/pfp-${draggingData.user.gender?.toLowerCase() || "male"}.png`}
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
				src={`/pfp-${user.gender?.toLowerCase() || "male"}.png`}
				alt={`${user.firstName} ${user.lastName}`}
				draggable={false}
			/>
			<h3>{displayName}</h3>
		</Link>
	);
}
