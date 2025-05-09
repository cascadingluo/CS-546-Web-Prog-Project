import { dbConnection, closeConnection } from "./config/mongoConnection.js";

const db = await dbConnection();

await db.dropDatabase();

await closeConnection();

console.log("Dropped all database entries.");
