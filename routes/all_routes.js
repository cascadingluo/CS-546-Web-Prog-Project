import express from "express";
import { sandboxes } from "../config/mongoCollections.js";
import { users } from "../config/mongoCollections.js";
import { register } from "../data/users.js";
import { login } from "../data/users.js";
import { createSandboxForUser } from "../data/sandboxes.js";
// import {renderList} from "../public/js/listForEdit.js"
import { getSandboxesbyUserId } from "../data/sandboxes.js";

//https://stackoverflow.com/questions/75004188/what-does-fileurltopathimport-meta-url-do
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let router = express.Router();

// if not signed in the render home page
router.route("/").get(async (req, res) => {
  if (req.session.user && req.session.user.signedIn === true) {
    //https://stackoverflow.com/questions/25463423/res-sendfile-absolute-path
    res.sendFile(
      path.resolve(__dirname, "../public/static/indexSignedIn.html")
    );
  } else {
    res.sendFile(path.resolve(__dirname, "../public/static/index.html"));
  }
});

// when submit shoudl be redirected to signed in index if correct
router
  .route("/login")
  .get(async (req, res) => {
    if (!req.session.user || req.session.user.signedIn === false) {
      res.sendFile(path.resolve(__dirname, "../public/static/login.html"));
    } else {
      res.redirect("/");
    }
  })
  .post(async (req, res) => {
    try {
      //code here for POST
      const userId = req.body.login_username;
      const password = req.body.login_password;
      const loggedin = await login(userId, password);
      if (!loggedin) {
        throw new Error("ADD ERR");
      }
      req.session.user = {
        signedIn: true,
        // id: get from Db
        userId: loggedin._id,
        userName: loggedin.userName,
        sandboxes: loggedin.sandboxes,
      };
      //finish for render
      // res.redirect('/private');
      if (req.session.user.signedIn === true) {
        res.redirect("/");
      } else {
        res.redirect("/login");
      }
    } catch (e) {
      // res.status(404).json({error: e});
      console.error(e);
      res.redirect("/login");
    }
  });

// when submit shoudl be redirected to signed in index if correct created
router
  .route("/signup")
  .get(async (req, res) => {
    if (!req.session.user || req.session.user.signedIn === false) {
      res.sendFile(path.resolve(__dirname, "../public/static/signup.html"));
    } else {
      res.redirect("/");
    }
  })
  .post(async (req, res) => {
    try {
      //code here for POST
      const userId = req.body.create_username;
      const password = req.body.create_password;
      const p2 = req.body.rep_pass;
      if (password !== p2) {
        throw new Error("Passwords dont match");
      }
      const age = Number(req.body.age);
      const email = req.body.email;
      const registered = await register(userId, email, age, password);
      if (!registered) {
        throw new Error("Could not register");
      }
      req.session.user = {
        signedIn: true,
        // id: get from Db
        userId: registered._id,
        userName: registered.userName,
        sandboxes: registered.sandboxes,
      };

      if (req.session.user.signedIn === true) {
        res.redirect("/");
      }
    } catch (e) {
      // res.status(404).json({error: e});
      console.error(e);
      res.redirect("/signup");
    }
  });

//can onyl view gallery if signed in
router.route("/viewSandboxes").get(checkSignIn, async (req, res) => {
  if (req.session.user && req.session.user.signedIn === true) {
    res.sendFile(
      path.resolve(__dirname, "../public/static/viewSandboxes.html")
    );
    //  renderList(getSandboxNames(req.session.user.userId));
  } else {
    res.redirect("/");
  }
});

router.route("/getSandboxesInfo").get(checkSignIn, async (req, res) => {
  if (req.session.user && req.session.user.signedIn === true) {
    let sandboxesList = getSandboxNames(req.session.user.userId);
    // let sandboxesList =[{
    //   name: "Test Sandbox",
    //   edit: "/edit/663c8d530f1c4a2c40f8c0a1",
    //   view: "/view/663c8d530f1c4a2c40f8c0a1",
    //   share: "http://localhost:3000/view/663c8d530f1c4a2c40f8c0a1"
    // }]
    res.json(sandboxesList);
  }
});

//   this version should have save
// FIGUREING OUT

router
  .route("/edit")
  .get(async (req, res) => {
    if (req.session.user && req.session.user.signedIn === true) {
      //make a new sandbox
      //route them to that /edit/{sandboxId}
      res.sendFile(path.resolve(__dirname, "../public/static/edit.html"));
    } else {
      res.sendFile(path.resolve(__dirname, "../public/static/editNoSave.html"));
    }
  })
  .post(async (req, res) => {
    try {
      const userId = req.body.userId;
      const name = req.body.name;
      // TO DO POPULATE SANDBOX WITH PLANTETS
      const loggedin = await createSandboxForUser(userId, name);
      if (!loggedin) {
        throw new Error("Not signed in or wrong credentials");
      }
    } catch (e) {
      console.error(e);
      res.redirect("/");
    }
  });

router.route("/edit/:SandboxId").get(async (req, res) => {
  //load the planets <-- Zach will do this
  //load the page
});

router.route("/logout").get(async (req, res) => {
  req.session.user = null;
  res.redirect("/");
});

router.route("/view/:SandboxId").get(async (req, res) => {
  // TO DO: SAND BOXES MUST BE LOADED FIRST
  if (req.session.user && req.session.user.signedIn === true) {
    res.sendFile(
      path.resolve(__dirname, "../public/static/viewSimSignedIn.html")
    );
  } else {
    res.sendFile(path.resolve(__dirname, "../public/static/viewSim.html"));
  }
});

function checkSignIn(req, res, next) {
  if (req.session.user && req.session.user.signedIn === true) {
    next();
  } else {
    //if they go somewhere were should not be send em' home
    res.redirect("/");
  }
}

function getSandboxNames(user) {
  let ret = [];
  let sandboxesLi = getSandboxesbyUserId(user);
  for (let i = 0; i < sandboxesLi.length; i++) {
    ret.append({
      name: sandboxesLi[i].name,
      edit: `/edit/${sandboxesLi[i]._id}`,
      view: `/view/${sandboxesLi[i]._id}`,
      // DEPENDENCY ON LOCALHOST:3000 - CHANGE LATER
      share: `http://localhost:3000/view/${sandboxesLi[i]._id}`,
    });
  }
  return ret;
}

export default router;
