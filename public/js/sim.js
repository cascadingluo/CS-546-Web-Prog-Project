const G = 6.67430e-3; // Graitational constant (stronger by 10^7 than irl to speed up sim and make numbers smaller)

//Common formula for finding perfect orbit velocity
//I took out G because mass and radius are not probably scared so it just works better w/o and a bit of magic number
function orbitVelocity(radius, centralMass) {
    return Math.sqrt(centralMass / radius); 
}

window.addEventListener('DOMContentLoaded', () => {
    const { Engine, Render, Runner, World, Bodies, Body, Vector, Events, Mouse, MouseConstraint } = Matter;

    const engine = Engine.create();
    const { world } = engine;
    engine.gravity.scale = 0; //zero gravity

    const canvas = document.getElementById('canvas');

    //https://brm.io/matter-js/docs/classes/Render.html#property_canvas
    //https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetWidth
    const render = Render.create({
        element: canvas,
        engine: engine,
        options: {
            width: canvas.offsetWidth,
            height: canvas.offsetHeight,
            wireframes: false,
            background: '#000',
        }
    });

    //FOR TESTING ONLY, CHANGE LATER
    const sunMass = 1000;
    const sunRadius = 30;
    const centerX = canvas.offsetWidth / 2;
    const centerY = canvas.offsetHeight / 2;
    const planets = [
        createPlanet("Sun", centerX, centerY, sunMass, sunRadius, {x: 0, y: 0}, true, "#FFFF00")
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
            render: { visible: false } //Blocks line that default show when dragging
        }
    });
    World.add(world, mouseConstraint);
    render.mouse = mouse;

    Events.on(mouseConstraint, 'mousedown', function(event) {
        if (mouseConstraint.body) return; 
        
        const mousePos = event.mouse.position;
        
        //FOR TESTING ONLY, CHANGE LATER        
        const velocity = {
          x: 0, 
          y: 0
        };

        const planet = createPlanet("Planet", mousePos.x, mousePos.y, 10, 10, velocity, false, "#1F7CDA");
        planets.push(planet);
        World.add(world, planet);
    });

    Events.on(engine, 'beforeUpdate', function(event) {
        let netForces = planets.map(() => ({x: 0, y: 0}));

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

    function createPlanet(
      name,
      x,
      y,
      mass,
      radius,
      velocity,
      isStatic,
      color
    ) {
      name      = checkIsValidName(name);
      const pos = checkIsValidPosition(x, y);
      mass      = Number(checkIsValidMass(mass)); 
      radius    = checkIsValidRadius(radius);
      velocity  = checkIsValidVelocity(velocity);
      isStatic  = checkIsValidIsStatic(isStatic);
      color     = checkIsValidColor(color);
    
      const planet = Bodies.circle(
        pos.x,
        pos.y,
        radius,
        {
          mass: mass,
          isStatic: isStatic,
          frictionAir: 0,
          friction: 0,
          render: { fillStyle: color }
        }
      );
    
      Body.setVelocity(planet, velocity);
      planet.custom = { mass, isStatic }
      return planet;
    }
});

// Check if string is not empty or just space and trims it
function checkIsValidString(str, argName) {
    if (typeof str !== "string" || str.trim() === "")
      throw `${argName}: Supply a non-empty string`;
    return str.trim();
  }
  
  function checkIsValidName(name) {
    return checkIsValidString(name, "Name");
  }
  
  function checkIsValidPosition(x, y) {
    if (typeof x !== "number") throw "x: Supply a number";
    if (typeof y !== "number") throw "y: Supply a number";
    return { x, y };
  }
  
  function checkIsValidMass(mass) {
    if (typeof mass !== "number") throw "Mass: Supply a number";
    if (mass === 0) throw "Mass: Cannot be zero";
    return mass; // Return the number directly!
  }
  
  function checkIsValidRadius(radius) {
    if (typeof radius !== "number") throw "Radius: Supply a number";
    if (radius === 0) throw "Radius: Cannot be zero";
    return radius;
  }
  
  function checkIsValidIsStatic(isStatic) {
    if (typeof isStatic !== "boolean") throw "IsStatic: Supply a boolean";
    return isStatic;
  }
  
  function checkIsValidVelocity(velocity) {
    if (!velocity || Object.keys(velocity).length !== 2)
      throw "Velocity: Supply an x and a y component";
    if (typeof velocity.x !== "number") throw "Velocity x: Supply a number";
    if (typeof velocity.y !== "number") throw "Velocity y: Supply a number";
    return velocity;
  }
  
  function checkIsValidColor(color) {
    color = checkIsValidString(color, "Color");
    const hexPattern = /^#[a-f0-9]{6}$/i;
    if (!hexPattern.test(color))
      throw "Color: Must be in the form #000000 - #FFFFFF";
    return color.toUpperCase();
  }
  
  function checkIsValidDensity(density) {
    if (typeof density !== "number") throw "Density: Supply a number";
    if (density === 0) throw "Density: Cannot be zero";
    return density;
  }
  
  function checkIsValidShape(shape) {
    shape = checkIsValidString(shape, "Shape");
    return shape; // Just return the shape name, fix shapeToBody later
  }