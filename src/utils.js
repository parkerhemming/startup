export const hobbyGroups = {
	Creative: ["Painting", "Drawing", "Photography", "Writing", "Music", "Dancing", "Pottery", "Fashion", "Cooking", "Baking"],
	Active: ["Hiking", "Running", "Yoga", "Gym", "Soccer", "Basketball", "Tennis", "Pickleball", "Skiing", "Surfing"],
	Social: ["Concerts", "Festivals", "Karaoke", "Board Games", "Trivia", "Volunteering", "Book Clubs", "Comedy Shows"],
	Cozy: ["Movies", "Reading", "Coffee", "Tea", "Gardening", "Puzzles", "Podcasts", "Video Games", "Anime"],
	Adventure: ["Travel", "Camping", "Road Trips", "Backpacking", "Climbing", "Scuba", "Food Tours", "Museums"]
};

export const hobbyOptions = Object.values(hobbyGroups).flat();

export function toProperCase(str = "") {
	return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

export function getPhoto(user, index = 0) {
	return user?.profilePics?.[index] || `/pfp-${user?.gender?.toLowerCase() || "male"}.png`;
}

export function ageFromBirthday(birthday) {
	if (!birthday) return "";
	const birthDate = new Date(birthday);
	const today = new Date();
	let age = today.getFullYear() - birthDate.getFullYear();
	const beforeBirthday = today.getMonth() < birthDate.getMonth() ||
		(today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate());
	return beforeBirthday ? age - 1 : age;
}

export function pairCount(match) {
	return match?.matchmakers?.length || (match?.pairedBy ? 1 : 0);
}

export function makeLedgerEntry(amount, text) {
	return {
		id: crypto.randomUUID(),
		amount,
		text,
		time: new Date().toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
	};
}

export async function increment(field, amount, setUser, text = "Coin update") {
	const response = await fetch("/api/increment", {
		method: "post",
		body: JSON.stringify({ field, increment: amount, text }),
		headers: { "Content-type": "application/json; charset=UTF-8" },
	});

	if (response.ok) setUser(await response.json());
}
