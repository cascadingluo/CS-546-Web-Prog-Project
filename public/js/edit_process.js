// DOM setup
let form = document.getElementById('editing_form');
let nameInput = document.getElementById('create-sandbox-name');
let xInput = document.getElementById('x-axis');
let yInput = document.getElementById('y-axis');
let massInput = document.getElementById('mass');
let radiusInput = document.getElementById('radius');
let modeInputs = document.getElementsByName('mode');
let velocityInput = document.getElementById('velocity');
let velDirInput = document.getElementById('vel-dir');
let colorInput = document.getElementById('planet-color');
let densityInput = document.getElementById('density');
let shapeInput = document.getElementById('shape');
let error = document.getElementById('error');

if (form) {
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        error.hidden = true;
        error.innerHTML = '';

        const name = nameInput.value.trim();
        const x = xInput.value.trim();
        const y = yInput.value.trim();
        const mass = massInput.value.trim();
        const radius = radiusInput.value.trim();
        const mode = Array.from(modeInputs).find(input => input.checked).value;
        const velocity = velocityInput.value.trim();
        const velDir = velDirInput.value.trim();
        const density = densityInput.value.trim();
        const shape = shapeInput.value;
        const color = colorInput.value;

        if (!name) {
            error.hidden = false;
            error.innerHTML = 'sandbox name is required';
            return;
        }

        if (!x) {
            error.hidden = false;
            error.innerHTML = 'the planet must have an x-axis';
            return;
        }

        if (!y) {
            error.hidden = false;
            error.innerHTML = 'the planet must have an y-axis';
            return;
        }

        if (!mass || mass < 0) {
            error.hidden = false;
            error.innerHTML = 'planet cannot have less than or equal to 0 mass';
            return;
        }

        if (!radius || radius <= 0) {
            error.hidden = false;
            error.innerHTML = 'planet cannot have less than or equal to 0 radius';
            return;
        }
        
        if (!mode || (mode !== 'static' && mode !== 'dynamic')) {
            error.hidden = false;
            error.innerHTML = 'the planet must be static or dynamic';
            return;
        }

        if (!velocity) {
            error.hidden = false;
            error.innerHTML = 'planet cannot have no velocity';
            return;
        }

        if (!velDir) {
            error.hidden = false;
            error.innerHTML = 'planet cannot have no velocity direction';
            return;
        }

        if(!density || (density <= 0)) {
            error.hidden = false;
            error.innerHTML = 'the planet cannot have no density or 0 or negative density';
            return;
        }

        if (!shape || (shape !== 'circle' && shape !== 'oval')) {
            error.hidden = false;
            error.innerHTML = 'the planet must be static or dynamic';
            return;
        }

        if (!color) {
            error.hidden = false;
            error.innerHTML = 'the planet must have a color';
            return;
        }

    });
}

function showError(message) {
    error.hidden = false;
    error.innerHTML = message;
}