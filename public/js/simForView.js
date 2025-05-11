const G = 6.6743e-3; // Graitational constant (stronger by 10^7 than irl to speed up sim and make numbers smaller)

const {
    Engine,
    Render,
    Runner,
    World,
    Bodies,
    Body,
    Events,
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

  fetch(`/api/sandbox/${sandboxId}`) //makes GET request to the server
    .then((res) => res.json())
    .then((data) => {
    //   sandboxNameInput.value = data.sandbox_name || "";
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
  Render.run(render);
  const runner = Runner.create({});
  Runner.run(runner, engine);
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
    planet.custom = { mass, isStatic: mode, radius };
    return planet;
  }

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