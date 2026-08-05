import React, { useState, useEffect } from "react";
import { Link, useNavigationType } from "react-router-dom";
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

export function PairMode2({ setUser, setCurrentPairs, setIsPairDisabled }) {
	const navType = useNavigationType();
	const [draggingData, setDraggingData] = useState(null);
	const [maleUsers, setMaleUsers] = useState([]);
	const [femaleUsers, setFemaleUsers] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		let isMounted = true;

		async function fetchProfiles() {
			try {
				if (navType === "POP") {
					const cachedMales =
						sessionStorage.getItem("pairMode2_males");
					const cachedFemales =
						sessionStorage.getItem("pairMode2_females");
					if (cachedMales && cachedFemales) {
						if (isMounted) {
							setMaleUsers(JSON.parse(cachedMales));
							setFemaleUsers(JSON.parse(cachedFemales));
							setIsLoading(false);
						}
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
					if (isMounted) {
						setMaleUsers(males);
						setFemaleUsers(females);
					}
				}
			} catch (error) {
				console.error(error);
			} finally {
				if (isMounted) {
					setIsLoading(false);
				}
			}
		}

		fetchProfiles();

		return () => {
			isMounted = false;
		};
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

	const rowCount = Math.min(4, maleUsers.length, femaleUsers.length);
	const rows = Array.from({ length: rowCount }, (_, i) => i);

	useEffect(() => {
		if (!isLoading && (maleUsers.length < 4 || femaleUsers.length < 4)) {
			setIsPairDisabled(true);
		} else {
			setIsPairDisabled(false);
		}

		return () => setIsPairDisabled(false);
	}, [isLoading, maleUsers.length, femaleUsers.length, setIsPairDisabled]);

	if (isLoading) {
		return (
			<main className="centerState" style={{ flexDirection: "column" }}>
				<div className="loadingCircle"></div>
				<h3 style={{ color: "#777" }}>Finding Matches...</h3>
			</main>
		);
	}

	if (maleUsers.length < 4 || femaleUsers.length < 4) {
		return (
			<main className="centerState" style={{ flexDirection: "column" }}>
				<i
					className="fa-solid fa-user-astronaut"
					style={{ fontSize: "48px", color: "#ccc" }}
				></i>
				<h2 style={{ color: "#777", margin: "10px 0 5px 0" }}>
					Out of Profiles
				</h2>
				<p style={{ color: "#aaa", fontSize: "14px" }}>
					We need more people to join before you can pair again!
				</p>
			</main>
		);
	}

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
