const boost_cost = 15;

export function toProperCase(str) {
	return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

export async function increment(field, increment, setUser) {
	const response = await fetch("/api/increment", {
		method: "post",
		body: JSON.stringify({ field, increment }),
		headers: {
			"Content-type": "application/json; charset=UTF-8",
		},
	});

	if (response.ok) {
		setUser(await response.json());
	}
}
