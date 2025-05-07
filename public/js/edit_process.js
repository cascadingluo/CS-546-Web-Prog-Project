// DOM setup
let form = document.getElementById("editing_form");
let nameInput = document.getElementById("create-sandbox-name");
let xInput = document.getElementById("x-axis");
let yInput = document.getElementById("y-axis");
let massInput = document.getElementById("mass");
let radiusInput = document.getElementById("radius");
let modeInputs = document.getElementsByName("mode");
let velocityInput = document.getElementById("velocity");
let colorInput = document.getElementById("planet-color");
let error = document.getElementById("error");

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    error.hidden = true;
    error.innerHTML = "";

    const name = nameInput.value.trim();
    const x = xInput.value.trim();
    const y = yInput.value.trim();
    const mass = massInput.value.trim();
    const radius = radiusInput.value.trim();
    const mode = Array.from(modeInputs).find((input) => input.checked).value;
    const velocity = velocityInput.value.trim();
    const color = colorInput.value.trim();

    if (!name) {
      showError("sandbox name is required");
      return;
    }

    if (!x) {
      showError("the planet must have an x-axis");
      return;
    }

    if (!y) {
      showError("the planet must have an y-axis");
      return;
    }

    if (!mass || mass < 0) {
      showError("planet cannot have less than or equal to 0 mass");
      return;
    }

    if (!radius || radius <= 0) {
      showError("planet cannot have less than or equal to 0 radius");
      return;
    }

    if (!mode || (mode !== "static" && mode !== "dynamic")) {
      showError("the planet must be static or dynamic");
      return;
    }

    if (!velocity) {
      showError("planet cannot have no velocity");
      return;
    }

    if (!color) {
      showError("the planet must have a color");
      return;
    }
  });
}

function showError(message) {
  error.hidden = false;
  error.innerHTML = message;
}
