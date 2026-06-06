import { generateYearMap, moods, getNote, saveLog, deleteLog } from "./utils.js";

generateYearMap();

let logDialogDate;
let viewDialogDate;

const viewDialog = document.getElementById("viewDialog");
const logDialog = document.getElementById("logDialog");

function openDay(el) {
	const now = new Date();
	const date = new Date(el.dataset.date);

	const todayOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
	if (dateOnly > todayOnly) return;

	if (el.dataset.logged) {
		viewDialogDate = el.dataset.date;
		document.getElementById("viewDate").innerText = date.toLocaleDateString("en");

		const viewMood = document.getElementById("viewMood");
		viewMood.innerText = moods[el.dataset.mood];
		viewMood.dataset.mood = el.dataset.mood;

		const note = getNote(el.dataset.date);
		const viewNote = document.getElementById("viewNote");
		viewNote.innerText = note || "No note for this day.";
		viewNote.classList.toggle("empty", !note);

		viewDialog.showModal();
	} else {
		logDialogDate = date.toISOString();
		document.getElementById("logDate").innerText = date.toLocaleDateString("en");
		document.getElementById("logMoodSelect").value = "";
		document.getElementById("logNote").value = "";
		logDialog.showModal();
	}
}

document.getElementById("yearMap").addEventListener("click", (e) => {
	if (e.target.classList.contains("day")) {
		openDay(e.target.closest(".day"));
	}
});

document.getElementById("logMood").addEventListener("click", () => {
	const now = new Date();
	const todayOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const todayCell = document.querySelector(`.day[data-date="${todayOnly.toISOString()}"]`);
	if (todayCell) openDay(todayCell);
});

document.getElementById("logSubmit").addEventListener("click", (e) => {
	const logMood = document.getElementById("logMoodSelect").value;
	const logNote = document.getElementById("logNote").value;

	if (!logMood) return; // no mood selected

	saveLog(logDialogDate, logMood, logNote);

	logDialog.close();
	generateYearMap();
});

document.getElementById("viewDelete").addEventListener("click", () => {
	if (!confirm("Remove the log for this day?")) return;

	deleteLog(viewDialogDate);

	viewDialog.close();
	generateYearMap();
});

document.getElementById("viewClose").addEventListener("click", () => {
	viewDialog.close();
});
