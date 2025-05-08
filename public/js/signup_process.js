
//  SADLY NOT NEEDED

// DOM setup
let form = document.getElementById('signup_form');
let usernameInput = document.getElementById('create_username');
let emailInput = document.getElementById('email');
let passwordInput = document.getElementById('create_password');
let rep_passInput = document.getElementById('rep_pass');
let ageInput = document.getElementById('age');
let error = document.getElementById('error');

if (form) {
    form.addEventListener('submit', (event) => {

        event.preventDefault();
        //i dont think we should trim the password and user?
        let username = usernameInput.value.trim(); 
        let password = passwordInput.value.trim();
        let rep_pass = rep_passInput.value.trim();
        let age = ageInput.value.trim();
        let email = emailInput.value.trim();
        error.hidden = true;
        error.innerHTML = '';

        //username ////////////////////////////////////
        if (!username) {
            error.hidden = false;
            error.innerHTML = 'username is required';
            return;
        }
        if (typeof username !== 'string') {
            error.hidden = false;
            error.innerHTML = 'The username must be a string';
            return;
        }
        username = username.trim();
        if (username.length === 0) {
            error.hidden = false;
            error.innerHTML = 'The username cannot be empty';
            return;
        }
        if (!/[a-zA-Z0-9]/.test(username)) {
            error.hidden = false;
            error.innerHTML = 'The string for username contains illegal characters';
            return;
        }      
        if (username.length < 5) {
            error.hidden = false;
            error.innerHTML = 'The string for username must be at least 5 characters long';
            return;
        }
        if (username.length > 10) {
            error.hidden = false;
            error.innerHTML = 'The string for username must be max of 10 characters';
            return;
        }

        //email ////////////////////////////////////
        if(!email) {
            error.hidden = false;
            error.innerHTML = 'email is required';
            return;
        }
        if (typeof email !== 'string') {
            error.hidden = false;
            error.innerHTML = 'Error: email must be a string';
            return;
        }
        email = email.trim();
        if (email.length === 0) {
            error.hidden = false;
            error.innerHTML = 'Error: email cannot be an empty string or string with just spaces';
            return;
        }
        const emailcheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailcheck.test(email)) {
        error.hidden = false;
        error.innerHTML = 'Email is invalid. Enter a valid email.';
        return;
        }

        //password ////////////////////////////////////
        if (!password) {
            error.hidden = false;
            error.innerHTML = 'password is required';
            return;
        }
        if (typeof password !== 'string') {
            error.hidden = false;
            error.innerHTML = 'password must be a string';
            return;
        }
        password = password.trim();
        if (password.length === 0) {
            error.hidden = false;
            error.innerHTML = 'password cannot empty or just spaces';
            return;
        }

        if (password.includes(" ")) {
            error.hidden = false;
            error.innerHTML = 'password cannot have spaces';
            return;
        }
        if (password.length < 8) {
            error.hidden = false;
            error.innerHTML = 'password cannot be shorter than 8 charaters';
            return;
        }
        if (password === password.toLowerCase()) {
            error.hidden = false;
            error.innerHTML = 'password must have at least one uppercase letter';
            return;
        }
        if (!/\d/.test(password)) {
            error.hidden = false;
            error.innerHTML = 'password must have at least one number';
            return;
        }
        if(!/[`!@#$%^&*()_+\-=\[\]{};':"\\|.,<>\/?~]/.test(password)) {
            error.hidden = false;
            error.innerHTML = 'password must have at least one special letter';
            return;
        }

        //repeat password ////////////////////////////////////
        if (!rep_pass || rep_pass !== password) {
            error.hidden = false;
            error.innerHTML = 'password is not inputted again correctly or is empty';
            return;
        }

        //age ////////////////////////////////////
        if (!age || age > 101 || age < 13) {
            error.hidden = false;
            error.innerHTML = 'age is either empty or you are not older than 13 and younger than 101';
            return;
        }
        if (isNaN(age)) {
            error.hidden = false;
            error.innerHTML = 'age must be a number';
            return;
        }
        
        form.submit();
    });
}
