// DOM setup
const form = document.getElementById("editing_form");
const sandboxNameInput = document.getElementById("create-sandbox-name");
const planetNameInput = document.getElementById("create-planet-name");
const xVelocityInput = document.getElementById("x-axis");
const yVelocityInput = document.getElementById("y-axis");
const massInput = document.getElementById("mass");
const radiusInput = document.getElementById("radius");
const modeInputs = document.getElementsByName("mode");
const colorInput = document.getElementById("planet-color");
const error = document.getElementById("error");

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    error.hidden = true;
    error.innerHTML = "";

    const sandboxName = sandboxNameInput.value.trim();
    const planetName = planetNameInput.value.trim();
    const vel_x = xVelocityInput.value.trim();
    const vel_y = yVelocityInput.value.trim();
    const mass = massInput.value.trim();
    const radius = radiusInput.value.trim();
    const mode = Array.from(modeInputs).find((input) => input.checked).value;
    const color = colorInput.value.trim();

    if (!sandboxName) {
      showError("sandbox name is required");
      return;
    }

    if (!planetName) {
      showError("planet name is required");
      return;
    }

    if (!vel_x) {
      showError("the planet must have an x-axis");
      return;
    }

    if (!vel_y) {
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

    if (!color) {
      showError("the planet must have a color");
      return;
    }
  });

  //HERE IS WHERE WE WILL CALL THE SAVE SANDBOX FUNCTION RESIDING IN SIM.JS
}

function showError(message) {
  error.hidden = false;
  error.innerHTML = message;
}
