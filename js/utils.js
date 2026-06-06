const MS_PER_DAY = 24 * 60 * 60 * 1000;

let data = {};

export const moods = {
	// Display -> Internal
	"Very Good": "very-good",
	Good: "good",
	Neutral: "neutral",
	Bad: "bad",
	"Very Bad": "very-bad",

	// Internal -> Display
	"very-good": "Very Good",
	good: "Good",
	neutral: "Neutral",
	bad: "Bad",
	"very-bad": "Very Bad",
};

export function saveLog(date, mood, note) {
	let specifiedDate = new Date(date);
	if (localStorage.getItem(`mood-data-${specifiedDate.getFullYear()}`)) {
		data = JSON.parse(localStorage.getItem(`mood-data-${specifiedDate.getFullYear()}`));
	} else {
		data = {};
	}

	data[`${specifiedDate.getDate()}-${specifiedDate.getMonth()}`] = { mood, note };
	localStorage.setItem(`mood-data-${specifiedDate.getFullYear()}`, JSON.stringify(data));

	return true;
}

export function deleteLog(date) {
	let specifiedDate = new Date(date);
	if (!localStorage.getItem(`mood-data-${specifiedDate.getFullYear()}`)) return false;

	data = JSON.parse(localStorage.getItem(`mood-data-${specifiedDate.getFullYear()}`));
	delete data[`${specifiedDate.getDate()}-${specifiedDate.getMonth()}`];
	localStorage.setItem(`mood-data-${specifiedDate.getFullYear()}`, JSON.stringify(data));

	return true;
}

export function getNote(date) {
	let specifiedDate = new Date(date);
	if (localStorage.getItem(`mood-data-${specifiedDate.getFullYear()}`)) {
		data = JSON.parse(localStorage.getItem(`mood-data-${specifiedDate.getFullYear()}`));
	} else {
		return "";
	}

	return data[`${specifiedDate.getDate()}-${specifiedDate.getMonth()}`]?.note || "";
}

export function generateYearMap() {
	const currentYear = new Date().getFullYear();
	if (localStorage.getItem(`mood-data-${currentYear}`)) {
		data = JSON.parse(localStorage.getItem(`mood-data-${currentYear}`));
	} else {
		data = {};
	}

	const yearMap = document.getElementById("yearMap");
	yearMap.innerHTML = "";

	document.getElementById("currentYear").innerText = currentYear;

	const start = new Date(currentYear, 0, 1);
	const end = new Date(currentYear + 1, 0, 1);

	const monthLabels = document.createElement("div");
	monthLabels.className = "monthLabels";

	const weekdayLabels = document.createElement("div");
	weekdayLabels.className = "weekdayLabels";

	const grid = document.createElement("div");
	grid.className = "dayGrid";

	const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	days.forEach((day, index) => {
		const label = document.createElement("span");
		label.textContent = day;
		label.style.gridRow = index + 1;
		weekdayLabels.appendChild(label);
	});

	const gridStart = new Date(start);
	gridStart.setDate(start.getDate() - start.getDay());

	let date = new Date(start);
	while (date < end) {
		const day = document.createElement("article");
		day.classList.add("day");
		day.title = date.toLocaleDateString("en");
		day.dataset.date = date.toISOString();
		const key = `${date.getDate()}-${date.getMonth()}`;
		if (data && data[key]) {
			const dataDay = data[key];
			day.classList.add(dataDay.mood);
			day.dataset.mood = dataDay.mood;
			day.dataset.logged = true;
		}

		const dayDiff = Math.floor((Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate())) / MS_PER_DAY);

		const weekIndex = Math.floor(dayDiff / 7);
		const dayIndex = date.getDay();

		day.style.gridColumn = weekIndex + 1;
		day.style.gridRow = dayIndex + 1;

		grid.appendChild(day);

		if (date.getDate() === 1) {
			const monthLabel = document.createElement("span");
			monthLabel.textContent = date.toLocaleString("en", { month: "short" });
			monthLabel.style.gridColumn = weekIndex + 1;
			monthLabels.appendChild(monthLabel);
		}

		date.setDate(date.getDate() + 1);
	}

	yearMap.append(monthLabels, weekdayLabels, grid);
}
