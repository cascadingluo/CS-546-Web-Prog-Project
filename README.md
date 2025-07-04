# Cosmic Canvas

![image](https://github.com/user-attachments/assets/2e8789af-1ebb-454a-a900-b9f1a7efc272)

This is the repository for Group 22's CS 546 final project, Cosmic Canvas. The team consists of Luo Xu (cascadingluo), Nicolas Banatt (PsioNicolas), Annanya Jain (JainAnnanya), Gursimran Vasir (gvasir), and Zachary Rosario (zachjesus).

## Getting started

Run `npm i` to install dependencies. To seed the database with initial test data, you can use `npm run seed` followed by `npm start` to start the server. Alternatively, just run the test command:

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

Inside a sandbox, you can place planets by clicking on the canvas after giving the planet a `name`, `mass`, `radius`, `x` and `y` components of the starting velocity, a `dynamic` state if you want it to be affected by gravity, and a `color`. You can also edit planets by clicking on them in the canvas and setting their new values. Give your sandbox a name before clicking `Save`, which will save the current state of the planets.

If you're logged in, you can choose to either `Create New Sandbox` or `View Sandboxes`. On the view page, you can choose to `Edit`, `View`, or `Delete` any of your existing sandboxes. You can also share a viewing link to anyone you'd like. When editing a sandbox, you can also share the URL to other users that are logged in; they will receive a copy of the sandbox that they can edit freely.

## Development timeline and summarized meeting notes

_week 1 of development:_

- physics sim (zach and nick): zach will work on the physics aspects of the project, nick will initialize the backend aspects of the objects and report back if needs help or theres a problem
- GUI (luo and simran): will meet seperately to create the flow and design of the applications, break work apart by page basis
- database (annaya): set up the database and report back if needs help or theres a problem

_week 2.5 of development:_

- backends (physics sim + db) will be merged before next meeting (zach, nick, annanya)
- frontends will be merged before the next meeting (luo, simran)
- the front and back will be merged during the week 3 meeting

_week 3 of development:_

- merging didnt happen as anticipated :(
- backend will meet and merge to avoid problems, many questions and uncertatinty in the sturcture and functionalities
- frontend will meet to finalize the css stylings and start implementation along with complete routings

_week 4 of development:_ 

- complete merging and intergration completed! further plans to refine the website
- start working on loading the simulation in the sandbox, creating sandboxes, and editing sandboxes
- will aim to complete everying by the weekend of may 10 - 11

_week 5 of development:_ 

- majority of the product has been completed, core functionalities are working expectantly and unexpectantly...
- breaking and debugging phrase for small issues, implementing AJAX to logins and signup, implementing xxs defense, seeding script creation
- finalizing development
- recording the final product and refinments for submission :)
