# Cosmic Canvas

This is the repository for Group 22's CS 546 final project, Cosmic Canvas. The team consists of Luo Xu, Nicolas Banatt, Annanya Jain, Gursimran Vasir, and Zachary Rosario.

## Getting started

To seed the database with initial test data, you can use `npm run seed` followed by `npm start` to start the server. Alternatively, just run the test command:

```bash
npm run test
```

## Users created by `npm run seed`

- username: testuser1
- email: testuser1@someemail.com
- age: 21
- password: testPassword1!
- sandboxes: Test sandbox one

---

- username: testuser2
- email: testuser2@someemail.com
- age: 23
- password: testPassword2!
- sandboxes: Test sandbox two

## How to use the website

After running `npm start`, visit the homepage at http://localhost:3000/. You can log in with one of the users from the seed above, or make your own user by signing up at the top left. If you don't want to log in, you can create a sandbox in guest mode by clicking `Create Guest Sandbox`.

Inside a sandbox, you can place planets by clicking on the canvas after giving the planet a `name`, `mass`, `radius`, `x` and `y` components of the starting velocity, a `dynamic` state if you want it to be affected by gravity, and a `color`.

### Development timeline

_week 1 of development:_

- physics sim (zach and nick): zach will work on the physics aspects of the project, nick will initialize the backend aspects of the objects and report back if needs help or theres a problem
- GUI (luo and simran): will meet seperately to create the flow and design of the applications, break work apart by page basis
- database (annaya): set up the database and report back if needs help or theres a problem

_week 2.5 of development:_

- backends (physics sim + db) will be merged before next meeting (zach, nick, annanya)
- frontends will be merged before the next meeting (luo, simran)
- the front and back will be merged during the week 3 meeting
