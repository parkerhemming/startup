import React, { useState } from "react";
import { getPhoto, hobbyGroups, hobbyOptions } from "./utils";

export function Loading({ text = "Loading" }) {
	return <div className="centerState"><div className="loadingCircle"></div><span>{text}</span></div>;
}

export function SmartImage({ user, index = 0, alt = "Profile", className = "" }) {
	const [loaded, setLoaded] = useState(false);
	return <span className={`imageWrap ${loaded ? "loaded" : ""} ${className}`}><img src={getPhoto(user, index)} alt={alt} draggable={false} onLoad={() => setLoaded(true)} /></span>;
}

export function HobbyPicker({ value, onChange }) {
	const [search, setSearch] = useState("");
	const selected = value ? value.split(",").map((x) => x.trim()).filter(Boolean) : [];
	const matches = hobbyOptions.filter((h) => h.toLowerCase().includes(search.toLowerCase()) && !selected.includes(h)).slice(0, 8);

	function add(hobby) {
		const next = [...selected, hobby].filter((x, i, a) => a.indexOf(x) === i);
		onChange(next.join(", "));
		setSearch("");
	}

	return <div className="hobbyPicker">
		<div className="hobbyAdd">
			<input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search hobbies" />
			<button type="button" className="btn" onClick={() => search && add(search)}>+</button>
		</div>
		<div className="hobbyPills">{selected.map((h) => <button type="button" key={h} onClick={() => onChange(selected.filter((x) => x !== h).join(", "))}>{h} ×</button>)}</div>
		{search && <div className="hobbyPills">{matches.map((h) => <button type="button" key={h} onClick={() => add(h)}>{h}</button>)}</div>}
		{!search && Object.entries(hobbyGroups).map(([group, hobbies]) => <div key={group}>
			<div className="hobbyGenre">{group}</div>
			<div className="hobbyPills">{hobbies.filter((h) => !selected.includes(h)).slice(0, 6).map((h) => <button type="button" key={h} onClick={() => add(h)}>{h}</button>)}</div>
		</div>)}
	</div>;
}
