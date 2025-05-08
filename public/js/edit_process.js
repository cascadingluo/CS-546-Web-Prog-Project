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
      error.hidden = false;
      error.innerHTML = "sandbox name is required";
      return;
    }

    if (!x) {
      error.hidden = false;
      error.innerHTML = "the planet must have an x-axis";
      return;
    }

    if (!y) {
      error.hidden = false;
      error.innerHTML = "the planet must have an y-axis";
      return;
    }

    if (!mass || mass < 0) {
      error.hidden = false;
      error.innerHTML = "planet cannot have less than or equal to 0 mass";
      return;
    }

    if (!radius || radius <= 0) {
      error.hidden = false;
      error.innerHTML = "planet cannot have less than or equal to 0 radius";
      return;
    }

    if (!mode || (mode !== "static" && mode !== "dynamic")) {
      error.hidden = false;
      error.innerHTML = "the planet must be static or dynamic";
      return;
    }

    if (!velocity) {
      error.hidden = false;
      error.innerHTML = "planet cannot have no velocity";
      return;
    }

    if (!color) {
      error.hidden = false;
      error.innerHTML = "the planet must have a color";
      return;
    }
  });

  //HERE IS WHERE WE WILL CALL THE SAVE SANDBOX FUNCTION RESIDING IN SIM.JS
}

function showError(message) {
  error.hidden = false;
  error.innerHTML = message;
}
