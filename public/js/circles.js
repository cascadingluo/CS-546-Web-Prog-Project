const Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Bodies = Matter.Bodies,
  Composite = Matter.Composite,
  MouseConstraint = Matter.MouseConstraint,
  Mouse = Matter.Mouse,
  Events = Matter.Events;

(function () {
  runEngine();
})();

// Initializes and runs (matter.js) engine
function runEngine() {
  const engine = Engine.create({ gravity: { y: 0 } });
  const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
      width: window.innerWidth,
      height: window.innerHeight,
      wireframes: false,
    },
  });
  const mouse = Mouse.create(render.canvas);
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: {
        visible: false,
      },
    },
  });

  Composite.add(engine.world, mouseConstraint);
  render.mouse = mouse;
  Render.run(render);

  // Every time a mouse is clicked, create a planet
  Events.on(mouseConstraint, "mousedown", function (event) {
    const mousePosition = event.mouse.position;
    const planet = [
      "Earth",
      mousePosition.x,
      mousePosition.y,
      1,
      100,
      false,
      { x: 100, y: 100 },
      "#FFFFFF",
      1,
      "Circle",
    ];

    try {
      createPlanet(engine, ...planet);
    } catch (e) {
      console.error(e);
    }
  });

  runner = Runner.create();
  Runner.run(runner, engine);
}

// Communicates between DOM and server to create a planet
// Spawns and returns the created planet
function createPlanet(
  engine,
  name,
  x,
  y,
  mass,
  radius,
  isStatic,
  velocity,
  color,
  density,
  shape
) {
  name = checkIsValidName(name);
  const position = checkIsValidPosition(x, y);
  mass = checkIsValidMass(mass);
  radius = checkIsValidRadius(radius);
  isStatic = checkIsValidIsStatic(isStatic);
  velocity = checkIsValidVelocity(velocity);
  color = checkIsValidColor(color);
  density = checkIsValidDensity(density);
  shape = checkIsValidShape(shape);

  const planet = spawnPlanet(
    engine,
    position,
    radius,
    isStatic,
    velocity,
    color,
    shape
  );

  // TODO: Call database API
}

// Mapping of shape string to matter.js body function
function shapeToBody(shape) {
  // TODO: Add more shapes
  switch (shape) {
    case "Circle":
      return Bodies.circle;
    default:
      throw "Shape: Invalid shape type";
  }
}

// Draws the planet on the screen with starting parameters
// Returns planet to store in the database
function spawnPlanet(
  engine,
  position,
  radius,
  isStatic,
  velocity,
  color,
  createShape
) {
  const planet = createShape(position.x, position.y, radius, {
    render: { fillStyle: color },
    isStatic,
    velocity,
  });
  Composite.add(engine.world, planet);
  return planet;
}

// Check if string is not empty or just space and trims it
function checkIsValidString(str, argName) {
  if (typeof str !== "string" || str.trim() === "")
    throw `${argName}: Supply a non-empty string`;
  return str.trim();
}

function checkIsValidName(name) {
  // TODO: Figure out which names are valid
  return checkIsValidString(name, "Name");
}

function checkIsValidPosition(x, y) {
  // TODO: Figure out what x and y values are valid
  if (typeof x !== "number") throw "x: Supply a number";
  if (typeof y !== "number") throw "y: Supply a number";
  return { x, y };
}

function checkIsValidMass(mass) {
  // TODO: Figure out what masses are valid
  if (typeof mass !== "number") throw "Mass: Supply a number";
  if (mass === 0) throw "Mass: Cannot be zero";
  return mass.toExponential();
}

function checkIsValidRadius(radius) {
  // TODO: Figure out what radii are valid
  if (typeof radius !== "number") throw "Radius: Supply a number";
  if (radius === 0) throw "Radius: Cannot be zero";
  return radius;
}

// Static is a bool stating whether or not the planet moves
function checkIsValidIsStatic(isStatic) {
  if (typeof isStatic !== "boolean") throw "IsStatic: Supply a boolean";
  return isStatic;
}

function checkIsValidVelocity(velocity) {
  // TODO: Figure out what x and y values are valid
  if (!velocity || Object.keys(velocity).length !== 2)
    throw "Velocity: Supply an x and a y component";
  if (typeof velocity.x !== "number") throw "Velocity x: Supply a number";
  if (typeof velocity.y !== "number") throw "Velocity y: Supply a number";
  return velocity;
}

// Color must be in the form "#000000" - "#FFFFFF" (case insensitive)
function checkIsValidColor(color) {
  color = checkIsValidString(color, "Color");

  const hexPattern = /^#[a-f0-9]{6}$/i;
  if (!hexPattern.test(color))
    throw "Color: Must be in the form #000000 - #FFFFFF";

  // Normalize string
  return color.toUpperCase();
}

function checkIsValidDensity(density) {
  if (typeof density !== "number") throw "Density: Supply a number";
  if (density === 0) throw "Density: Cannot be zero";
  return density;
}

function checkIsValidShape(shape) {
  shape = checkIsValidString(shape, "Shape");
  // Convert to matter.js representation
  return shapeToBody(shape);
}
