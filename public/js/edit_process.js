// // DOM setup
// const form = document.getElementById("editing_form");
// const sandboxNameInput = document.getElementById("create-sandbox-name");
// const planetNameInput = document.getElementById("create-planet-name");
// const xVelocityInput = document.getElementById("x-axis");
// const yVelocityInput = document.getElementById("y-axis");
// const massInput = document.getElementById("mass");
// const radiusInput = document.getElementById("radius");
// const modeInputs = document.getElementsByName("mode");
// const colorInput = document.getElementById("planet-color");
// const error = document.getElementById("error");

// if (form) {
//   form.addEventListener("submit", (event) => {
//     event.preventDefault();

//     error.hidden = true;
//     error.innerHTML = "";

//     const sandboxName = sandboxNameInput.value.trim();
//     const planetName = planetNameInput.value.trim();
//     let vel_x = xVelocityInput.value.trim();
//     let vel_y = yVelocityInput.value.trim();
//     let mass = massInput.value.trim();
//     let radius = radiusInput.value.trim();
//     const mode = Array.from(modeInputs).find((input) => input.checked).value;
//     const color = colorInput.value.trim();

//     if (!sandboxName) {
//       error.hidden = false;
//       error.innerHTML = "sandbox name is required";
//       return;
//     }
//     if (typeof sandboxName !== "string" || sandboxName.trim() === "") {
//       error.hidden = false;
//       error.innerHTML = "sandbox name must be a string and not only spaces";
//       return;
//     }

//     if (!planetName) {
//       error.hidden = false;
//       error.innerHTML = "planet name is required";
//       return;
//     }
//     if (typeof planetName !== "string" || planetName.trim() === "") {
//       error.hidden = false;
//       error.innerHTML = "planet name must be a string and not only spaces";
//       return;
//     }

//     if (!vel_x) {
//       error.hidden = false;
//       error.innerHTML = "the planet must have an x-axis velocity";
//       return;
//     }
//     vel_x = Number(xVelocityInput.value.trim());
//     if (typeof vel_x !== "number" || isNaN(vel_x)) {
//       error.hidden = false;
//       error.innerHTML = "the x-axis velocity must be an number";
//       return;
//     }

//     if (!vel_y) {
//       error.hidden = false;
//       error.innerHTML = "the planet must have an y-axis velocity";
//       return;
//     }
//     vel_y = Number(yVelocityInput.value.trim());
//     if (typeof vel_y !== "number" || isNaN(vel_y)) {
//       error.hidden = false;
//       error.innerHTML = "the y-axis velocity must be an number";
//       return;
//     }

//     if (!mass) {
//       error.hidden = false;
//       error.innerHTML = "planet must have a mass";
//       return;
//     }
//     mass = Number(massInput.value.trim());
//     if (typeof mass !== "number" || isNaN(mass) || mass < 0) {
//       error.hidden = false;
//       error.innerHTML = "mass must be a number greater than 0";
//       return;
//     }

//     if (!radius) {
//       error.hidden = false;
//       error.innerHTML = "planet must have a radius";
//       return;
//     }
//     radius = Number(radiusInput.value.trim());
//     if (typeof radius !== "number" || isNaN(radius) || radius <= 0) {
//       error.hidden = false;
//       error.innerHTML = "radius must be a number greater than or equal to 0";
//       return;
//     }

//     if (!mode || (mode !== "static" && mode !== "dynamic")) {
//       error.hidden = false;
//       error.innerHTML = "the planet must be static or dynamic";
//       return;
//     }

//     if (!color) {
//       error.hidden = false;
//       error.innerHTML = "the planet must have a color";
//       return;
//     }
//     const hexPattern = /^#[a-f0-9]{6}$/i;
//     if (!hexPattern.test(color)) {
//       error.hidden = false;
//       error.innerHTML = "the color inputted is invalid";
//       return;
//     }
//   });

//   // form.submit();

//   //HERE IS WHERE WE WILL CALL THE SAVE SANDBOX FUNCTION RESIDING IN SIM.JS
// }
