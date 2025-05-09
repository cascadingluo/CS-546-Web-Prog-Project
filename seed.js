import { dbConnection, closeConnection } from "./config/mongoConnection.js";
import sandboxes from "./data/sandboxes.js";
import users from "./data/users.js";

const db = await dbConnection();
await db.dropDatabase();

console.log("Seeding the database...");

let user1;
try {
  user1 = await users.register(
    "testUser1",
    "testUser1@someEmail.com",
    21,
    "testPassword0!"
  );
} catch (e) {
  exitWithFailure(e);
}

let sandbox1;
try {
  sandbox1 = await sandboxes.createSandboxForUser(
    user1.user._id,
    "Test sandbox one"
  );
} catch (e) {
  exitWithFailure(e);
}

// let planet1;
// try {
//   planet1 = await sandboxes.createPlanetInSandbox(sandbox1.sandboxId);
// } catch (e) {
//   console.error(e);
// }

console.log("Done seeding the database.");

await closeConnection();

function exitWithFailure(errorMsg) {
  console.error(errorMsg);
  process.exit(1);
}
