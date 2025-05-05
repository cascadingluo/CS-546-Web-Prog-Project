//You can add and export any helper functions you want here. If you aren't using any, then you can just leave this file as is.

import {ObjectId} from 'mongodb';

const exportedMethods = {
    checkId(id, varName) {
        if (!id) throw `Error: You must provide a ${varName}`;
        if (typeof id !== 'string') throw `Error:${varName} must be a string`;
        id = id.trim();
        if (id.length === 0)
          throw `Error: ${varName} cannot be an empty string or just spaces`;
        if (!ObjectId.isValid(id)) throw `Error: ${varName} invalid object ID`;
        return id;
    },
    
    checkString(strVal, varName) {
        if (!strVal) throw `Error: You must supply a ${varName}!`;
        if (typeof strVal !== 'string') throw `Error: ${varName} must be a string!`;
        strVal = strVal.trim();
        if (strVal.length === 0)
            throw `Error: ${varName} cannot be an empty string or string with just spaces`;
        return strVal;
    },

    character_validity(str, str_replace){
        for (let i = 0; i < str.length; i++){
          let unicode = str.charCodeAt(i);
          if (!(unicode >= 65 && unicode <= 90) && !(unicode >= 97 && unicode <= 122) && unicode !== 32){
            throw `The string for ${str_replace}: ${str} contains an invalid character "${str[i]}". It must be only alphabets.`;
          }
        }
        return true;
    },

    character_in_string_validity(str, str_replace) {
        for (let i = 0; i < str.length; i++){
          let unicode = str.charCodeAt(i);
          if (!(unicode >= 65 && unicode <= 90) && !(unicode >= 97 && unicode <= 122) && !(unicode >= 48 && unicode <= 57)){
            throw `The string for ${str_replace} : ${str} contains an invalid character "${str[i]}". It must be either an alphabet or number`;
          }
        }
        return true;
    },

    checkIsProperName(name, varName) {
        name = this.checkString(name, varName);
        this.character_validity(name, varName);
        if (name.length < 2)
            throw `The string for ${varName}: ${name} must be at least 2 characters long`;
        if (name.length > 20)
            throw `The string for ${varName}: ${name} must be max of 20 characters`;
        return name;
    },

    checkIsProperUserName(user_name, varName){
        user_name = this.checkString(user_name, varName);
        this.character_in_string_validity(user_name, varName);
        if (user_name.length < 5)
            throw `The string for ${varName}: ${user_name} must be at least 5 characters long`;
        if (user_name.length > 10)
            throw `The string for ${varName}: ${user_name} must be max of 10 characters`;
        return user_name;
    },

    checkIsProperPassword(pass, varName){
        pass = this.checkString(pass, varName);
        if (pass.includes(" "))
            throw `The string for ${varName}: ${pass} must not contain any space.`;
        if (pass.length < 8)
            throw `The string for ${varName}: ${pass} must be at least 8 characters long`;
        if (pass === pass.toLowerCase())
            throw `The string for ${varName}: ${pass} must contain atleast one uppercase character`;
        if (!/\d/.test(pass))
            throw `The string for ${varName}: ${pass} must contain at least one number `;
        if(!/[`!@#$%^&*()_+\-=\[\]{};':"\\|.,<>\/?~]/.test(pass))
            throw `The string for ${varName}: ${pass} must contain at least one special character`;
        return pass;
    },

    checkIsProperEmail(email, varName){
        email = this.checkString(email, varName);
        if (!validator.isEmail(email)){
            throw `Error: Email id is invalid. Enter valid email id.`;
        }
        return email.toLowerCase();
    },

    checkIsProperAge(age, varName){
        if(!age)
            throw `Error: You must provide a ${varName}`;
        if (typeof age !== 'number') throw `Error:${varName} must be a number`;
        if (!Number.isInteger(age))
          throw `Error: ${varName} must be an integer.`;
        if (age < 13 || age > 120)
            throw `Error: ${varName} must be in a valid age range`;
        return age;
    }
};

export default exportedMethods;