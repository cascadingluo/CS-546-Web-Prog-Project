const G = 6.6743e-3;

//Common formula for finding perfect orbit velocity
function orbitVelocity(radius, centralMass) {
  return Math.sqrt(centralMass / radius);
}

let editPlanet = false;

window.addEventListener("DOMContentLoaded", () => {
  // DOM setup
  const form = document.getElementById("editing_form");
  const sandboxNameInput = document.getElementById("create-sandbox-name");
  const planetNameInput = document.getElementById("create-planet-name");
  const xVelocityInput = document.getElementById("x-axis");
  const yVelocityInput = document.getElementById("y-axis");
  const massInput = document.getElementById("mass");
  const radiusInput = document.getElementById("radius");
  const modeInput = document.getElementById("mode");
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

  const planets = [];

  World.add(world, planets);

  //https://brm.io/matter-js/docs/classes/Mouse.html
  const mouse = Mouse.create(render.canvas);

  //https://brm.io/matter-js/docs/classes/MouseConstraint.html
  //This makes the mouse interactible with bodies
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0, //https://brm.io/matter-js/docs/classes/Constraint.html#property_stiffness
      render: { visible: false }, //Blocks line that default show when dragging
    },
  });
  World.add(world, mouseConstraint);
  render.mouse = mouse;

  Events.on(mouseConstraint, "mouseup", function (event) {
    if (mouseConstraint.body) return;
    if (editPlanet) return;

    const mousePos = event.mouse.position;

    if (form) {
      const sandboxName = sandboxNameInput.value.trim();
      const name = planetNameInput.value;
      const vel_x = xVelocityInput.value;
      const vel_y = yVelocityInput.value;
      const mass = massInput.value;
      const radius = radiusInput.value;
      const mode = !modeInput.checked;
      const color = colorInput.value;

      console.log(mode);

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

      // if (typeof sandboxId !== "undefined") {
      //   const planetData = {
      //     sandboxName,
      //     planetName: name,
      //     x: mousePos.x,
      //     y: mousePos.y,
      //     radius: parseFloat(radius),
      //     mass: parseFloat(mass),
      //     velocity: { x: parseFloat(vel_x), y: parseFloat(vel_y) },
      //     isStatic: mode === "static",
      //     color: color.toUpperCase(),
      //   };
      //   savePlanetToSandbox(sandboxId, planetData);
      // }
    }
  });

  Events.on(mouseConstraint, "mousedown", async function (event) {
    if (!mouseConstraint.body) return;
    if (editPlanet) return;
    editPlanet = true;

    const planet = mouseConstraint.body;

    let name, mass, radius, vel_x, vel_y, vel, mode, color;
    try {
      //https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm
      //https://developer.mozilla.org/en-US/docs/Web/API/Window/prompt
      name = prompt("New Name:", planet.label);
      name = checkIsValidName(name);
      mass = prompt("New Mass:", planet.custom.mass);
      mass = checkIsValidMass(mass);
      radius = prompt("New Radius:", planet.circleRadius);
      radius = checkIsValidRadius(radius);
      vel_x = prompt("New X Velocity:", planet.velocity.x);
      vel_y = prompt("New Y Velocity:", planet.velocity.y);
      vel = checkIsValidVelocity({ x: vel_x, y: vel_y });
      mode = confirm("Click ok to make static cancel for dynamic")
        ? true
        : false; //i think this returns a boolean but you can never be sure...
      color = prompt("New Color Hex:", planet.render.fillStyle);
      color = checkIsValidColor(color);
    } catch (e) {
      setTimeout(() => {
        editPlanet = false;
      }, 100);
      return;
    }
    planet.label = name;
    planet.custom.mass = mass;
    Body.setMass(planet, mass);
    planet.custom.isStatic = mode;
    planet.isStatic = mode;
    planet.circleRadius = radius;
    Body.setVelocity(planet, vel);
    planet.render.fillStyle = color;

    // const planet_index = planets.findIndex((p) => {
    //   return p.label === planet.label;
    // });

    // planets[planet_index] = planet;

    setTimeout(() => {
      editPlanet = false;
    }, 100);
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

  //load planets from saved sandbox
  //this should be able to render everything if the box already existed
  fetch(`/api/sandbox/${sandboxId}`) //makes GET request to the server
    .then((res) => res.json())
    .then((data) => {
      sandboxNameInput.value = data.sandbox_name || "";
      if (data.planets && Array.isArray(data.planets)) {
        for (const p of data.planets) {
          try {
            const planet = createPlanet(
              //all info about the planet returns
              p.name,
              p.x,
              p.y,
              p.mass,
              p.radius,
              p.velocity || { x: 0, y: 0 },
              p.isStatic,
              p.color
            );
            planets.push(planet);
            World.add(world, planet);
          } catch (e) {
            console.error("failed to load planet:", p.name, e);
          }
        }
      }
    })
    .catch((err) => {
      console.error("Failed to load sandbox planets:", err);
    });

  // Save the list of planets to sandbox when form is submitted
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const sandboxName = sandboxNameInput.value.trim();
    if (typeof sandboxId !== "undefined") {
      // Convert from matter.js body to database representation
      const planetsData = planets.map((planet) => {
        return {
          name: planet.label,
          x: planet.position.x,
          y: planet.position.y,
          radius: parseFloat(planet.circleRadius),
          mass: parseFloat(planet.mass),
          velocity: Body.getVelocity(planet),
          isStatic: planet.custom.isStatic,
          color: planet.render.fillStyle,
        };
      });
      savePlanetsToSandbox(sandboxId, sandboxName, planetsData);

      // for (const planet of planets) {
      //   const planetData = {
      //     sandboxName,
      //     planetName: planet.label,
      //     x: planet.position.x,
      //     y: planet.position.y,
      //     radius: parseFloat(planet.circleRadius),
      //     mass: parseFloat(planet.mass),
      //     velocity: Body.getVelocity(planet),
      //     isStatic: planet.isStatic,
      //     color: planet.render.fillStyle,
      //   };
      //   savePlanetToSandbox(sandboxId, planetData);
      // }
    }
    //form.submit();
  });

  function createPlanet(name, x, y, mass, radius, velocity, mode, color) {
    name = checkIsValidName(name);
    const pos = checkIsValidPosition(x, y);
    mass = checkIsValidMass(mass);
    radius = checkIsValidRadius(radius);
    velocity = checkIsValidVelocity(velocity);
    // mode = checkIsValidMode(mode);
    color = checkIsValidColor(color);

    const planet = Bodies.circle(pos.x, pos.y, radius, {
      label: name,
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

  // planetsData: List of database planet objects
  async function savePlanetsToSandbox(sandboxId, sandboxName, planetsData) {
    //sends new planets to the server
    try {
      const response = await fetch(`/edit/${sandboxId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sandboxName,
          planetsData,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        console.error("unable to save the planets:", result);
        error.hidden = false;
        error.innerHTML = result.error;
      } else {
        console.log("planets were sucessfully saved");
      }
    } catch (e) {
      error.hidden = false;
      error.innerHTML = "failed to save planets";
    }
  }

  // function submitAndSavePlanet() {
  //   const sandboxName = sandboxNameInput.value.trim();
  //   const name = planetNameInput.value.trim();
  //   const vel_x = parseFloat(xVelocityInput.value.trim());
  //   const vel_y = parseFloat(yVelocityInput.value.trim());
  //   const mass = parseFloat(massInput.value.trim());
  //   const radius = parseFloat(radiusInput.value.trim());
  //   const mode = Array.from(modeInputs).find((input) => input.checked).value;
  //   const color = colorInput.value.trim();

  //   try {
  //     const planet = createPlanet(
  //       name,
  //       canvas.offsetWidth / 2,
  //       canvas.offsetHeight / 2,
  //       mass,
  //       radius,
  //       { x: vel_x, y: vel_y },
  //       mode,
  //       color
  //     );
  //     planets.push(planet);
  //     World.add(world, planet);

  //     if (typeof sandboxId !== "undefined") {
  //       const planetData = {
  //         name,
  //         x: planet.position.x,
  //         y: planet.position.y,
  //         radius,
  //         mass,
  //         velocity: { x: vel_x, y: vel_y },
  //         isStatic: mode === "static",
  //         color,
  //       };
  //       savePlanetToSandbox(sandboxId, planetData);
  //     }
  //   } catch (e) {
  //     error.hidden = false;
  //     error.innerHTML = e;
  //   }
  // }
  //https://stackoverflow.com/questions/9880279/how-do-i-add-a-simple-onclick-event-handler-to-a-canvas-element
  async function waitForClick() {
    return new Promise((resolve) => {
      canvas.addEventListener("click", function handler(event) {
        canvas.removeEventListener("click", handler);
        resolve({ x: mouse.position.x, y: mouse.position.y });
      });
    });
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
