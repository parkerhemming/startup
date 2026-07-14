const boost_cost = 15;

export function toProperCase(str) {
	return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

export function getCoins() {
	return localStorage.getItem("coins");
}

export function updateCoins(num) {
	const coins = getCoins() || 0;
	localStorage.setItem("coins", Number(coins) + num);
}

export function getBoost() {
	return localStorage.getItem("boost");
}

export function updateBoost(num) {
	const coins = getCoins() || 0;
	if (coins < boost_cost * num) return false;
	const boost = getBoost();
	updateCoins(-(boost_cost * num));
	localStorage.setItem("boost", Number(boost) + num);
	return true;
}
