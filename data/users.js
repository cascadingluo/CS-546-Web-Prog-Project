import {users} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
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
      throw `Error:  User with this ${userName} or ${email} already exists.`;
  
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

    return { signupCompleted: true, 
      user: {
        _id: newUser._id.toString(),
        userName: newUser.userName,
        email: newUser.email,
        age: newUser.age,
        sandboxes: []
      }
    };
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

    return {
      _id : fetch_User._id.toString(),
      userName: fetch_User.userName,
      email: fetch_User.email,
      age: fetch_User.age,
      sandboxes: fetch_User.sandboxes.map((id) => id.toString())
    };
  };

  export const getAllUsers= async() => {
    const usersCollection = await users();
      let userList = await usersCollection.find({}).toArray();
      if(!userList) throw 'Could not get all users';
      
      return userList.map(user => ({
        _id: user._id.toString(),
        userName: user.userName, 
        email: user.email
      }));
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

    return {
      _id : user._id.toString(),
      userName: user.userName,
      email: user.email,
      age: user.age,
      sandboxes: user.sandboxes.map((id) => id.toString())
    };
  };

export default {register, login, getAllUsers, getUserById}