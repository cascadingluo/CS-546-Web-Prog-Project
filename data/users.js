import {sandboxes, users} from '../config/mongoCollections.js';
import {ObjectId, ReturnDocument} from 'mongodb';
import helper from '../helpers.js'
import bcrypt from 'bcrypt';

const saltRounds = 16;

export const register = async (
    userName,
    email,
    age,
    password,
  ) => {
    if (userName === undefined || email === undefined|| age === undefined || password === undefined) {
      throw "All fields need to have valid values";
    }
  
    userName = helper.checkIsProperUserName(userName, "User Name");
    email = helper.checkIsProperEmail(email, "Email Id");
    age = helper.checkIsProperAge(age, "Age");
    password = helper.checkIsProperPassword(password, "Password");
  
    const usersCollection = await users();
  
    let does_userId_exist = await usersCollection.findOne({
      $or: [{userName: userName.toLowerCase()}, {email: email.toLowerCase()}]
    });
    
    if(does_userId_exist)
      throw `Error:  User with this ${userId} or ${email} already exists.`;
  
    let hash_pass = await bcrypt.hash(password, saltRounds);
  
    let newUser = {
      _id: new ObjectId(),
      userName: userName.toLowerCase(),
      email: email.toLowerCase(),
      age: Number(age),
      password: hash_pass,
      sandboxes: []
    };
  
    const insertInfo = await usersCollection.insertOne(newUser);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Could not add user';
    return { signupCompleted: true, userName: insertInfo.insertedId };
  };
  
  export const login = async (userName, password) => {
    if (userName === undefined || password === undefined) {
      throw "Error: Both userId and password must be supplied";
    }
  
    userName = helper.checkIsProperUserName(userName, "User Name");
    password = helper.checkIsProperPassword(password, "Password");
    const usersCollection = await users();
    const fetch_User = await usersCollection.findOne({
      userName: userName.toLowerCase()
    });
    
    if(!fetch_User)
      throw `Either the userName or password is invalid`;
  
    let check_password = await bcrypt.compare(password, fetch_User.password);
    if(!check_password)
      throw `Either the userName or password is invalid`;
  
    let user = updated_user.value;

    return {
      _id : user._id.toString(),
      userName: user.userName,
      email: user.email,
      age: user.age,
      sandboxes: user.sandboxes.map((id) => id.toString())
    };
  };

  export const getAllUsers= async() => {
    const usersCollection = await users();
      let userList = await usersCollection.find({}).toArray();
      if(!userList) throw 'Could not get all users';
      userList = userList.map((user) => {
        user._id = user._id.toString();
        return {_id: user._id, userName: user.userName, email:user.email};
      });
      
      return userList;
  };

  export const getUserById = async(userId) => {
    if (!userId) throw 'You must provide an id to search for';
      if (typeof userId !== 'string') throw 'Id must be a string';
      if(userId.trim().length === 0)
          throw 'Id cannot be an empty string or just spaces';
      userId = userId.trim();
      if(!ObjectId.isValid(userId)) throw 'Invalid object Id';

      const usersCollection = await users();
      const user = await usersCollection.findOne({_id: new ObjectId(userId)});
      if (!user) throw 'No user with that id';
      user._id = user._id.toString();
      if(Array.isArray(user.sandboxes)){
       user.sandboxes = user.sandboxes.map(sandboxId => sandboxId.toString());
      }
      const {password, ...otherDetails} = user_details;
      return otherDetails;
  };

  
