// module aliases
var Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Bodies = Matter.Bodies,
  Composite = Matter.Composite,
  MouseConstraint = Matter.MouseConstraint,
  Mouse = Matter.Mouse,
  Events = Matter.Events;

// create an engine
var engine = Engine.create({ gravity: { y: 0 } });

// create a renderer
var render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width: window.innerWidth,
    height: window.innerHeight,
    wireframes: false,
  },
});

// create two boxes and a ground
var circleA = Bodies.circle(400, 200, 40);
var circleB = Bodies.circle(450, 50, 40);

// add mouse control
var mouse = Mouse.create(render.canvas),
  mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: {
        visible: false,
      },
    },
  });

Composite.add(engine.world, mouseConstraint);
// add all of the bodies to the world
Composite.add(engine.world, [circleA, circleB]);

// keep the mouse in sync with rendering
render.mouse = mouse;
// run the renderer
Render.run(render);

// an example of using mouse events on a mouse
Events.on(mouseConstraint, "mousedown", function (event) {
  var mousePosition = event.mouse.position;
  //   console.log("mousedown at " + mousePosition.x + " " + mousePosition.y);
  //   shakeScene(engine);
  var circleC = Bodies.circle(mousePosition.x, mousePosition.y, 40, {
    render: { fillStyle: randomColor() },
  });
  Composite.add(engine.world, [circleC]);
});

// create runner
var runner = Runner.create();

// run the engine
Runner.run(runner, engine);

function randomColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}
