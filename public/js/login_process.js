// // DOM setup
//  SADLY NOT NEEDED

let form = document.getElementById("login_form");
let usernameInput = document.getElementById("login_username");
let passwordInput = document.getElementById("login_password");
let error = document.getElementById("error");

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    //i dont think we should trim the password and user?
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    // error.hidden = true;
    // error.innerHTML = "";

    if (!username) {
      error.hidden = false;
      error.innerHTML = "username is required";
      return;
    }

    if (!password) {
      error.hidden = false;
      error.innerHTML = "password is required";
      return;
    }

    // form.submit();

    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          login_username: username,
          login_password: password
        })
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        error.hidden = false;
        error.innerHTML = result.error || 'Login failed.';
      } else {
        window.location.href = '/';
      }
    } catch (err) {
      error.hidden = false;
      error.innerHTML = 'Log in unsuccessful.';
    }

  });
}
