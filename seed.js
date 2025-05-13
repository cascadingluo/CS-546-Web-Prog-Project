import { dbConnection, closeConnection } from "./config/mongoConnection.js";
import sandboxes from "./data/sandboxes.js";
import users from "./data/users.js";

const db = await dbConnection();
await db.dropDatabase();

console.log("Seeding the database...");

// User 1
const user1 = await users.register(
  "testuser1",
  "testuser1@someemail.com",
  21,
  "testPassword1!"
);
const sandbox1 = await sandboxes.createSandboxForUser(
  user1.user._id,
  "Test sandbox one"
);
await sandboxes.updateAllPlanetsInSandbox(sandbox1.sandboxId, [
  {
    name: "Sun",
    x: 600,
    y: 300,
    radius: 30,
    mass: 2000,
    isStatic: true,
    color: "#FFFF00",
    velocity: { x: 0, y: 0 },
  },
  {
    name: "Mercury",
    x: 670,
    y: 300,
    radius: 3,
    mass: 5,
    isStatic: false,
    color: "#EBEBEB",
    velocity: { x: 0, y: 2 },
  },
  {
    name: "Venus",
    x: 725,
    y: 300,
    radius: 3,
    mass: 10,
    isStatic: false,
    color: "#A57C1B",
    velocity: { x: 0, y: 2 },
  },
  {
    name: "Earth",
    x: 790,
    y: 300,
    radius: 10,
    mass: 10,
    isStatic: false,
    color: "#4F4CB0",
    velocity: { x: 0, y: 2 },
  },
  {
    name: "Mars",
    x: 850,
    y: 300,
    radius: 5,
    mass: 10,
    isStatic: false,
    color: "#C1440E",
    velocity: { x: 0, y: 2 },
  },
  {
    name: "Jupiter",
    x: 900,
    y: 300,
    radius: 15,
    mass: 30,
    isStatic: false,
    color: "#E3DCCB",
    velocity: { x: 0, y: 2 },
  },
  {
    name: "Saturn",
    x: 960,
    y: 300,
    radius: 13,
    mass: 20,
    isStatic: false,
    color: "#CEB8B8",
    velocity: { x: 0, y: 2 },
  },
  {
    name: "Uranus",
    x: 1000,
    y: 300,
    radius: 10,
    mass: 15,
    isStatic: false,
    color: "#D1E7E7",
    velocity: { x: 0, y: 2 },
  },
  {
    name: "Neptune",
    x: 1040,
    y: 300,
    radius: 10,
    mass: 13,
    isStatic: false,
    color: "#5B5DDF",
    velocity: { x: 0, y: 2 },
  },
]);

// User 2
const user2 = await users.register(
  "testuser2",
  "testuser2@someemail.com",
  23,
  "testPassword2!"
);
const sandbox2 = await sandboxes.createSandboxForUser(
  user2.user._id,
  "Test sandbox two"
);
await sandboxes.updateAllPlanetsInSandbox(sandbox2.sandboxId, [
  {
    name: "Sun",
    x: 600,
    y: 300,
    radius: 30,
    mass: 2000,
    isStatic: true,
    color: "#FFFF00",
    velocity: { x: 0, y: 0 },
  },
  {
    name: "Earth",
    x: 790,
    y: 300,
    radius: 10,
    mass: 10,
    isStatic: false,
    color: "#4F4CB0",
    velocity: { x: 0, y: 2 },
  },
]);

console.log("Done seeding the database.");
console.log(`
Users that have been seeded in the database for testing:
----------------------------------------------------------
- username: testuser1
- email: testuser1@someemail.com
- age: 21
- password: testPassword1!
- sandboxes: Test sandbox one
----------------------------------------------------------
- username: testuser2
- email: testuser2@someemail.com
- age: 23
- password: testPassword2!
- sandboxes: Test sandbox two
`);

await closeConnection();
