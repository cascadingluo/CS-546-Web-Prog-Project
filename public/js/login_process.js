// DOM setup

let form = document.getElementById('login_form');
let usernameInput = document.getElementById('login_username');
let passwordInput = document.getElementById('login_password');
let error = document.getElementById('error');

if (form) {
    form.addEventListener('submit', (event) => {

        event.preventDefault();
        //i dont think we should trim the password and user?
        const username = usernameInput.value; 
        const password = passwordInput.value;
        error.hidden = true;
        error.innerHTML = '';

        if (!username) {
            error.hidden = false;
            error.innerHTML = 'username is required';
            return;
        }

        if (!password) {
            error.hidden = false;
            error.innerHTML = 'password is required';
            return;
        }

    });
}