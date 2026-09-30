const countDisplay = document.querySelector("#count");
const stepInput = document.querySelector("#step");
const incrementButton = document.querySelector("#increment");
const decrementButton = document.querySelector("#decrement");
const resetButton = document.querySelector("#reset");

const storageKey = "counter-app-state";
let count = 0;
let step = 1;

try {
	const savedState = JSON.parse(localStorage.getItem(storageKey));

	if (Number.isSafeInteger(savedState?.count)) {
		count = savedState.count;
	}

	if (Number.isSafeInteger(savedState?.step) && savedState.step > 0) {
		step = savedState.step;
	}
} catch {
	// The app remains usable when browser storage is unavailable.
}

stepInput.value = String(step);

function render() {
	countDisplay.textContent = count.toLocaleString();

	try {
		localStorage.setItem(storageKey, JSON.stringify({ count, step }));
	} catch {
		// Keep counting even when the browser blocks storage writes.
	}
}

function updateCount(direction) {
	const nextCount = count + direction * step;

	if (Number.isSafeInteger(nextCount)) {
		count = nextCount;
		render();
	}
}

incrementButton.addEventListener("click", () => updateCount(1));
decrementButton.addEventListener("click", () => updateCount(-1));

resetButton.addEventListener("click", () => {
	count = 0;
	render();
});

stepInput.addEventListener("change", () => {
	const nextStep = Number(stepInput.value);

	if (Number.isSafeInteger(nextStep) && nextStep > 0) {
		step = nextStep;
	}

	stepInput.value = String(step);
	render();
});

document.addEventListener("keydown", (event) => {
	if (event.altKey || event.ctrlKey || event.metaKey || event.target instanceof HTMLInputElement) {
		return;
	}

	if (event.key === "ArrowUp") {
		event.preventDefault();
		updateCount(1);
	} else if (event.key === "ArrowDown") {
		event.preventDefault();
		updateCount(-1);
	} else if (event.key.toLowerCase() === "r") {
		count = 0;
		render();
	}
});

render();
