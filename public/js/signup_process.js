// DOM setup

// let form = document.getElementById('signup_form');
// let usernameInput = document.getElementById('create_username');
// let passwordInput = document.getElementById('create_password');
// let rep_passInput = document.getElementById('rep_pass');
// let ageInput = document.getElementById('age');
// let error = document.getElementById('error');

// if (form) {
//     form.addEventListener('submit', (event) => {

//         event.preventDefault();
//         //i dont think we should trim the password and user?
//         const username = usernameInput.value.trim(); 
//         const password = passwordInput.value.trim();
//         const rep_pass = rep_passInput.value.trim();
//         const age = ageInput.value.trim();
//         error.hidden = true;
//         error.innerHTML = '';

//         if (!username) {
//             error.hidden = false;
//             error.innerHTML = 'username is required';
//             return;
//         }

//         if (!password) {
//             error.hidden = false;
//             error.innerHTML = 'password is required';
//             return;
//         }

//         if (!rep_pass || rep_pass !== password) {
//             error.hidden = false;
//             error.innerHTML = 'password is not inputted again correctly or is empty';
//             return;
//         }

//         if (!age || age > 101 || age < 13) {
//             error.hidden = false;
//             error.innerHTML = 'age is either empty or you are not older than 13 and younger than 101';
//             return;
//         }

//     });
// }