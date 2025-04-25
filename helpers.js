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
    },

    checkIsProperQuote(quote, varName){
        quote = this.checkString(quote, varName);
        if (quote.length < 20)
            throw `The string for ${varName}: ${quote} must be at least 20 characters long`;
        if (quote.length > 255)
            throw `The string for ${varName}: ${quote} must be max of 255 characters`;
        return quote;
    },

    checkIsProperTheme(theme, varName){
        if (!theme) throw `Error: You must provide a ${varName}`;
        if (typeof theme !== 'object' || Array.isArray(theme))
            throw `Error:${varName} must be an object`;
        let properties_keys = Object.keys(theme);
        if (properties_keys.length != 2)
            throw `Error: ${varName} length is invalid. It must contain exactly two properties: backgroundColor, and fontColor`;

        if (!properties_keys.includes("backgroundColor") || !properties_keys.includes("fontColor"))
            throw `Error: ${varName} must have properties named "backgroundColor", and "fontColor"`;

        let backgd_color = theme.backgroundColor;
        let font_color = theme.fontColor;

        backgd_color = this.checkString(backgd_color, "backgroundColor");
        font_color = this.checkString(font_color, "fontColor");

        //referred this link for seeing the hexcode pattern : https://www.geeksforgeeks.org/check-if-a-given-string-is-a-valid-hexadecimal-color-code-or-not/
        var hexaPattern = /^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;
        if (!hexaPattern.test(backgd_color))
            throw `Error: themePreference.backgroundColor: ${backgd_color} is an invalid hex color code`; 

        if (!hexaPattern.test(font_color))
            throw `Error: themePreference.fontColor: ${font_color} is an invalid hex color code`; 

        if(backgd_color.toLowerCase() !== font_color.toLowerCase())
            throw `Error: background color: ${backgd_color} and the font color: ${font_color} must be the same values`;

        return theme;
    },

    checkIsProperRole(role, varName){
        role = this.checkString(role, varName);
        role = role.toLowerCase();
        if (role !== "superuser" && role !== "user")
            throw `Error: ${varName} must be a valid value i.e either "superuser" or "user"`; 

        return role;
    },

    valid_date() {
        let current_date = new Date();
        let dd = String(current_date.getDate()).padStart(2, '0');
        let mm = String(current_date.getMonth() + 1).padStart(2, '0');
        let yyyy = current_date.getFullYear();
        return `${mm}/${dd}/${yyyy}`;
    },

    valid_time() {
        let current_time = new Date();
        let hh = current_time.getHours();
        let period = '';
        if (hh >= 12){
            period = 'PM';
        }
        else{
            period = 'AM';
        }
        hh = hh % 12;
        if (hh === 0)
            hh = 12;
        hh = String(hh).padStart(2, '0');

        let min = String(current_time.getMinutes()).padStart(2, '0');
        return `${hh}:${min}${period}`;
    }

};

export default exportedMethods;

