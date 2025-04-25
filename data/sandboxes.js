import {sandboxes, users} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';

export const createSandboxForUser = async (userId) => {
    if (!ObjectId.isValid(userId)) {
        throw 'Error: Invalid userId';
    }
    const usersCollection = await users();
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    
    if (!user) {
        throw `Error: No user found with userId ${userId}`;
    }

    const sandboxesCollection = await sandboxes();
    const sandboxId = new ObjectId();
  
    let newSandbox = {
      _id: sandboxId,
      planets: []
    };
  
    const insertInfo = await sandboxesCollection.insertOne(newSandbox);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Could not add a new sandbox for the user';
    await usersCollection.updateOne(
        {_id: new ObjectId(userId)},
        {$push: {sandboxes: sandboxId}}
    )

    return { sandboxId: newSandbox._id.toString()};
  };