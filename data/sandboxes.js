import { sandboxes, users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import helper from "../helpers.js";

export const createSandboxForUser = async (userId, sandbox_Name) => {
  if (!ObjectId.isValid(userId)) {
    throw "Error: Invalid userId";
  }

  sandbox_Name = helper.checkIsProperName(sandbox_Name, "Sandbox name");
  const usersCollection = await users();
  const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

  if (!user) {
    throw `Error: No user found with userId ${userId}`;
  }

  const sandboxesCollection = await sandboxes();
  const sandboxId = new ObjectId();

  let newSandbox = {
    _id: sandboxId,
    sandbox_name: sandbox_Name,
    planets: [],
  };

  const insertInfo = await sandboxesCollection.insertOne(newSandbox);
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw "Could not add a new sandbox for the user";

  const updated_user_sandbox = await usersCollection.findOneAndUpdate(
    { _id: new ObjectId(userId) },
    { $push: { sandboxes: sandboxId } },
    { returnDocument: "after" }
  );

  return {
    updated_user_sandbox: updated_user_sandbox,
    sandboxId: sandboxId.toString(),
  };
};

export const createPlanetInSandbox = async (sandboxId, planet_object, name) => {
  if (!ObjectId.isValid(sandboxId)) {
    throw "Error: Invalid Sandbox Id";
  }

  const { x, y, radius, mass, isStatic, color, velocity } = planet_object;

  name = helper.checkIsProperName(name, "planet");
  if (typeof x !== "number" || isNaN(x)) throw "Invalid Position x";
  if (typeof y !== "number" || isNaN(y)) throw "Invalid Position y";
  if (typeof radius !== "number" || radius <= 0 || isNaN(radius)) throw "Invalid radius: must be a valid number greater than 0";
  if (typeof mass !== "number" || mass <= 0 || isNaN(mass)) throw "Invalid mass: must be a valid number greater than 0";
  if (typeof isStatic !== "boolean") throw "isStatic must be of type boolean";
  if (typeof color !== "string" || !color) throw "color must be a string type";
  var hexaPattern = /^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;
  if (!hexaPattern.test(color))
    throw `Error: ${color} is an invalid hex color code`;

  if (
    typeof velocity !== "object" ||
    typeof velocity.x !== "number" || isNaN(velocity.x) ||
    typeof velocity.y !== "number" || isNaN(velocity.y)
  ) {
    throw "velocity must be an object with valid x and y";
  }

  // I need to check the frontend fields to see exactly what the planet object looks like and what we are passing into the backend
  let new_planet = {
    _id: new ObjectId(),
    name,
    x,
    y,
    radius,
    mass,
    isStatic,
    color,
    velocity,
  };

  const sandboxesCollection = await sandboxes();
  const sandbox = await sandboxesCollection.findOne({
    _id: new ObjectId(sandboxId),
  });

  if (!sandbox) throw "Error: Sandbox not found";

  const planet_created = await sandboxesCollection.findOneAndUpdate(
    { _id: new ObjectId(sandboxId) },
    { $push: { planets: new_planet } },
    { returnDocument: "after" }
  );

  return planet_created;
};

export const getSandboxesbyUserId = async (userId) => {
  if (!ObjectId.isValid(userId)) {
    throw "Error: Invalid user Id";
  }

  const usersCollection = await users();
  const user = await usersCollection.findOne(
    { _id: new ObjectId(userId) },
    { projection: { sandboxes: 1 } }
  );

  if (!user || user.sandboxes.length === 0) {
    return [];
  }

  const sandboxesCollection = await sandboxes();
  let sandbox_docs = await sandboxesCollection
    .find(
      { _id: { $in: user.sandboxes.map((id) => new ObjectId(id)) } },
      { projection: { _id: 1, sandbox_name: 1, planets: 1 } }
    )
    .toArray();

  return sandbox_docs.map((sand_box) => ({
    ...sand_box,
    _id: sand_box._id.toString(),
    planets: sand_box.planets
  }));
};

export const getSandboxesById = async (sandboxId) => {
  if (!ObjectId.isValid(sandboxId)) {
    throw "Error: Invalid sandbox Id";
  }

  const sandboxesCollection = await sandboxes();
  const sandbox = await sandboxesCollection.findOne({
    _id: new ObjectId(sandboxId),
  });

  if (!sandbox) {
    throw `Error: No sandbox found with sandbox id ${sandboxId}`;
  }

  return {
    ...sandbox,
    _id: sandbox._id.toString(),
    planets: sandbox.planets.map((planet) => ({
      ...planet,
      _id: planet._id.toString(),
    })),
  };
};

export const removeSandbox = async (userId, sandboxId) => {
  if (!ObjectId.isValid(userId)) {
    throw "Error: Invalid user Id";
  }

  if (!ObjectId.isValid(sandboxId)) {
    throw "Error: Invalid sandbox Id";
  }

  const usersCollection = await users();
  const user_sandbox = await usersCollection.findOne({
    _id: new ObjectId(userId),
    sandboxes: { $in: [new ObjectId(sandboxId)] },
  });

  if (!user_sandbox) {
    throw `Error: No user found with sandbox id ${sandboxId} and userId ${userId}`;
  }

  const updated_user = await usersCollection.findOneAndUpdate(
    { _id: new ObjectId(userId) },
    { $pull: { sandboxes: new ObjectId(sandboxId) } },
    { returnDocument: "after" }
  );

  const sandboxesCollection = await sandboxes();
  await sandboxesCollection.findOneAndDelete({
    _id: new ObjectId(sandboxId),
  });

  return updated_user;
};

export const updateSandboxName = async (sandboxId, newName) => {
  if (!ObjectId.isValid(sandboxId)) {
    throw "invalid sandbox ID";
  }
  newName = helper.checkIsProperName(newName, "Sandbox name");

  const sandboxesCollection = await sandboxes();
  const result = await sandboxesCollection.findOneAndUpdate(
    { _id: new ObjectId(sandboxId) },
    { $set: { sandbox_name: newName } },
    { returnDocument: "after" }
  );

  if (!result) throw "Failed to update sandbox name";
  return result;
};

export const updateAllPlanetsInSandbox = async (sandboxId, planets) => {
  if (!ObjectId.isValid(sandboxId)) throw "invalid sandbox ID";
  if (!Array.isArray(planets)) throw "invalid planets list";

  const sandboxesCollection = await sandboxes();
  const sandbox = await sandboxesCollection.findOneAndUpdate(
    { _id: new ObjectId(sandboxId) },
    { $set: { planets: [] } },
    { returnDocument: "after" }
  );

  if (!sandbox) throw "Failed to empty planets";

  const insertedPlanets = [];
  // Error checking for individual planets already done in createPlanetInSandbox
  for (const planet of planets) {
    const insertedPlanet = await createPlanetInSandbox(
      sandboxId,
      planet,
      planet.name
    );
    if (!insertedPlanet) throw "Error inserting planet";
    insertedPlanets.push(insertedPlanet);
  }

  return insertedPlanets;
};

export default {
  updateSandboxName,
  createSandboxForUser,
  createPlanetInSandbox,
  getSandboxesbyUserId,
  removeSandbox,
  getSandboxesById,
  updateAllPlanetsInSandbox,
};
