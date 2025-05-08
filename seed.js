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
  console.error(e);
}

console.log("Done seeding the database.");
