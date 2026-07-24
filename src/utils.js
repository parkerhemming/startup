const boost_cost = 15;

export function toProperCase(str) {
	return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

export function getUser() {
	return JSON.parse(localStorage.getItem("user"));
}

function updateUser(user) {
	localStorage.setItem("user", JSON.stringify(user));
}

export function getCoins() {
	return getUser().coins;
}

export function updateCoins(num) {
	const coins = getCoins() || 0;
	const user = getUser();
	user.coins += num;
	updateUser(user);
}

export function getBoost() {
	return getUser().boost;
}

export function updateBoost(num) {
	const coins = getCoins() || 0;
	if (coins < boost_cost * num) return false;
	const boost = getBoost();
	updateCoins(-(boost_cost * num));
	const user = getUser();
	user.boost += num;
	updateUser(user);
	return true;
}
