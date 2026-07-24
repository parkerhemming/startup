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
		{
			id: "m5",
			firstName: "James",
			lastName: "Wilson",
			birthday: "1992-07-18",
			gender: "Male",
			bio: "Music and sports are life.",
			interests: "Guitar, Basketball",
			pfp1: {},
			pfp2: {},
			pfp3: {},
			pfp4: {},
			isBig: false,
		},
		{
			id: "m6",
			firstName: "Ryan",
			lastName: "Carter",
			birthday: "1997-09-30",
			gender: "Male",
			bio: "Living life one road trip at a time.",
			interests: "Travel, Surfing",
			pfp1: {},
			pfp2: {},
			pfp3: {},
			pfp4: {},
			isBig: true,
		},
		{
			id: "m7",
			firstName: "Tyler",
			lastName: "Moore",
			birthday: "1999-01-14",
			gender: "Male",
			bio: "Foodie hunting for the best tacos.",
			interests: "Cooking, Tacos, Gaming",
			pfp1: {},
			pfp2: {},
			pfp3: {},
			pfp4: {},
			isBig: false,
		},
		{
			id: "m8",
			firstName: "Josh",
			lastName: "Taylor",
			birthday: "1994-12-02",
			gender: "Male",
			bio: "Fitness instructor and bookworm.",
			interests: "Reading, Weightlifting",
			pfp1: {},
			pfp2: {},
			pfp3: {},
			pfp4: {},
			isBig: false,
		},
		{
			id: "m9",
			firstName: "Alex",
			lastName: "White",
			birthday: "2000-05-11",
			gender: "Male",
			bio: "Art and design everywhere.",
			interests: "Design, Sketching, Museums",
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
				src={`/pfp-${user.gender.toLowerCase()}.png`}
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
