const G = 6.6743e-3; // Graitational constant (stronger by 10^7 than irl to speed up sim and make numbers smaller)

//Common formula for finding perfect orbit velocity
//I took out G because mass and radius are not probably scared so it just works better w/o and a bit of magic number
function orbitVelocity(radius, centralMass) {
  return Math.sqrt(centralMass / radius);
}

window.addEventListener("DOMContentLoaded", () => {
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

  const {
    Engine,
    Render,
    Runner,
    World,
    Bodies,
    Body,
    Events,
    Mouse,
    MouseConstraint,
  } = Matter;

  const engine = Engine.create();
  const { world } = engine;
  engine.gravity.scale = 0; //zero gravity

  const canvas = document.getElementById("canvas");

  //https://brm.io/matter-js/docs/classes/Render.html#property_canvas
  //https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetWidth
  const render = Render.create({
    element: canvas,
    engine: engine,
    options: {
      width: canvas.offsetWidth,
      height: canvas.offsetHeight,
      wireframes: false,
      background: "#000",
    },
  });

  //FOR TESTING ONLY, CHANGE LATER
  const sunMass = 1000;
  const sunRadius = 30;
  const centerX = canvas.offsetWidth / 2;
  const centerY = canvas.offsetHeight / 2;
  const planets = [
    createPlanet(
      "Sun",
      centerX,
      centerY,
      sunMass,
      sunRadius,
      { x: 0, y: 0 },
      "static",
      "#FFFF00"
    ),
  ];

  World.add(world, planets);

  //https://brm.io/matter-js/docs/classes/Mouse.html
  const mouse = Mouse.create(render.canvas);

  //https://brm.io/matter-js/docs/classes/MouseConstraint.html
  //This makes the mouse interactible with bodies
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.3, //https://brm.io/matter-js/docs/classes/Constraint.html#property_stiffness
      render: { visible: false }, //Blocks line that default show when dragging
    },
  });
  World.add(world, mouseConstraint);
  render.mouse = mouse;

  Events.on(mouseConstraint, "mousedown", function (event) {
    if (mouseConstraint.body) return;

    const mousePos = event.mouse.position;

    if (form) {
      //const sandboxName = sandboxNameInput.value.trim();
      const name = planetNameInput.value;
      const vel_x = xVelocityInput.value;
      const vel_y = yVelocityInput.value;
      const mass = massInput.value;
      const radius = radiusInput.value;
      const mode = Array.from(modeInputs).find((input) => input.checked).value;
      const color = colorInput.value;

      let planet;
      try {
        planet = createPlanet(
          name,
          mousePos.x,
          mousePos.y,
          mass,
          radius,
          { x: vel_x, y: vel_y },
          mode,
          color
        );
      } catch (e) {
        error.hidden = false;
        error.innerHTML = e;
        return;
      }

      error.hidden = true;
      error.innerHTML = "";

      planets.push(planet);
      World.add(world, planet);
    }
  });

  Events.on(engine, "beforeUpdate", function (event) {
    let netForces = planets.map(() => ({ x: 0, y: 0 }));

    for (let i = 0; i < planets.length; i++) {
      const p1 = planets[i];
      if (p1.custom.isStatic) continue;
      for (let j = 0; j < planets.length; j++) {
        if (i === j) continue;
        const p2 = planets[j];

        const dx = p2.position.x - p1.position.x;
        const dy = p2.position.y - p1.position.y;
        const rSquared = dx * dx + dy * dy;
        if (rSquared === 0) continue;

        const r = Math.sqrt(rSquared);

        const m1 = p1.custom.mass;
        const m2 = p2.custom.mass;
        const force = (G * m1 * m2) / rSquared;
        const fx = force * (dx / r);
        const fy = force * (dy / r);

        netForces[i].x += fx;
        netForces[i].y += fy;
      }
    }

    for (let i = 0; i < planets.length; i++) {
      const p = planets[i];
      if (p.custom.isStatic) continue;
      Body.applyForce(p, p.position, netForces[i]);
    }
  });

  Render.run(render);
  const runner = Runner.create({});
  Runner.run(runner, engine);

  function createPlanet(name, x, y, mass, radius, velocity, mode, color) {
    name = checkIsValidName(name);
    const pos = checkIsValidPosition(x, y);
    mass = checkIsValidMass(mass);
    radius = checkIsValidRadius(radius);
    velocity = checkIsValidVelocity(velocity);
    mode = checkIsValidMode(mode);
    color = checkIsValidColor(color);

    const planet = Bodies.circle(pos.x, pos.y, radius, {
      mass: mass,
      isStatic: mode,
      frictionAir: 0,
      friction: 0,
      render: { fillStyle: color },
    });

    Body.setVelocity(planet, velocity);
    planet.custom = { mass, isStatic: mode };
    return planet;
  }
});

// Check if string is not empty or just space and trims it
function checkIsValidString(str, argName) {
  if (typeof str !== "string" || str.trim() === "")
    throw `${argName}: Supply a value`;
  return str.trim();
}

function checkIsValidName(name) {
  return checkIsValidString(name, "Planet name");
}

function checkIsValidPosition(x, y) {
  x = parseFloat(x);
  y = parseFloat(y);
  if (typeof x !== "number" || isNaN(x)) throw "x: Supply a number";
  if (typeof y !== "number" || isNaN(y)) throw "y: Supply a number";
  return { x, y };
}

function checkIsValidMass(mass) {
  mass = parseFloat(mass);
  if (typeof mass !== "number" || isNaN(mass)) throw "Mass: Supply a number";
  if (mass <= 0) throw "Mass: Cannot be less than or equal to zero";
  return mass;
}

function checkIsValidRadius(radius) {
  radius = parseFloat(radius);
  if (typeof radius !== "number" || isNaN(radius))
    throw "Radius: Supply a number";
  if (radius <= 0) throw "Radius: Cannot be less than or equal to zero";
  return radius;
}

function checkIsValidMode(mode) {
  mode = mode.trim();
  if (mode !== "static" && mode !== "dynamic")
    throw "Mode: Supply either static or dynamic!";
  return mode === "static";
}

function checkIsValidVelocity(velocity) {
  if (
    typeof velocity !== "object" ||
    Object.keys(velocity).length !== 2 ||
    velocity.x === undefined ||
    velocity.y === undefined
  )
    throw "Velocity: Supply an x and a y component";

  velocity.x = parseFloat(velocity.x);
  velocity.y = parseFloat(velocity.y);
  if (typeof velocity.x !== "number" || isNaN(velocity.x))
    throw "Velocity x: Supply a number";
  if (typeof velocity.y !== "number" || isNaN(velocity.y))
    throw "Velocity y: Supply a number";
  return velocity;
}

function checkIsValidColor(color) {
  color = checkIsValidString(color, "Color");
  const hexPattern = /^#[a-f0-9]{6}$/i;
  if (!hexPattern.test(color))
    throw "Color: Must be in the form #000000 - #FFFFFF";
  return color.toUpperCase();
}

// function checkIsValidDensity(density) {
//   if (typeof density !== "number" || isNaN(density))
//     throw "Density: Supply a number";
//   if (density === 0) throw "Density: Cannot be zero";
//   return density;
// }

// function checkIsValidShape(shape) {
//   shape = checkIsValidString(shape, "Shape");
//   return shape; // Just return the shape name, fix shapeToBody later
// }
