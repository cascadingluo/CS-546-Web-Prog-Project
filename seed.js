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
