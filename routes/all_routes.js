import express from "express";
import { sandboxes } from "../config/mongoCollections.js";
import { users } from "../config/mongoCollections.js";
import { register } from "../data/users.js";
import { login } from "../data/users.js";
import {
  createSandboxForUser,
  removeSandbox,
  updateAllPlanetsInSandbox,
  updateSandboxName,
  getSandboxesbyUserId,
  createPlanetInSandbox,
  getSandboxesById,
} from "../data/sandboxes.js";
// import {renderList} from "../public/js/listForEdit.js"
import fs from "fs";
import helper from  "../helpers.js"
import xss from "xss";

//https://stackoverflow.com/questions/75004188/what-does-fileurltopathimport-meta-url-do
import path from "path";
import { fileURLToPath } from "url";
import { ObjectId } from "mongodb";

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
      let input = req.body;
      for (let k in input){
        input[k] = xss(input[k]);
      }

      const userId = helper.checkString(input.login_username, "username");
      const password = helper.checkString(input.login_password, "password");
      const loggedin = await login(userId, password);
      if (!loggedin) {
        return res.status(400).json({ error: "Username or password is incorrect." });
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
        return res.status(200).json({ message: "Login successful" });
      } else {
        return res.status(400).json({ error: "Login failed" });
      }
    } catch (e) {
      // res.status(404).json({error: e});
      console.error(e);
      return res.status(500).json({ error: "Login unsuccessful: Either the Username or password is incorrect." });
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
      let input = req.body;
      for (let k in input){
        input[k] = xss(input[k]);
      }
      const userId = helper.checkIsProperUserName(input.create_username, "username");
      const password = helper.checkIsProperPassword(input.create_password, "password");
      const p2 = input.rep_pass;
      if (password !== p2) {
        return res.status(400).json({ error: "Passwords do not match." });
      }
      const age = helper.checkIsProperAge(Number(input.age), "Age");
      const email = helper.checkIsProperEmail(input.email, "email");
      const usersCollection = await users();
      const exist = await usersCollection.findOne({ userId: userId.toLowerCase() });
      if (exist) {
        return res.status(400).json({ error: "Username already exists, please chose another username" });
      }
      const registered = await register(userId, email, age, password);
      if (!registered) {
        return res.status(500).json({ error: "Register user unsuccessful" });
      }
      req.session.user = {
        signedIn: true,
        // id: get from Db
        userId: registered.user._id,
        userName: registered.user.userName,
        sandboxes: registered.user.sandboxes,
      };

      // if (req.session.user.signedIn === true) {
      //   res.redirect("/");
      // }
      return res.status(200).json({ message: "User registered successfully" });
    } catch (e) {
      // res.status(404).json({error: e});
      console.error(e);
      res.redirect("/signup");
      return res.status(500).json();
      //return res.status(404).json({error: e.toString()});
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
    let sandboxesList = await getSandboxNames(req.protocol, req.get('host') , req.session.user.userId);
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
      // res.sendFile(path.resolve(__dirname, '../public/static/edit.html'));
      try {
        const userId = req.session.user.userId;
        const newSandbox = await createSandboxForUser(
          userId,
          "untitled sandbox"
        );
        const sandboxId = newSandbox.sandboxId;
        req.session.user.sandboxes.push(sandboxId);
        res.redirect(`/edit/${sandboxId}`);
      } catch (error) {
        console.error("error creating sandbox:", error);
        res.redirect("/");
      }
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
    try {
      const sandboxId = req.params.SandboxId;
      const userId = req.session.user.userId;

      if (req.session.user.sandboxes.includes(sandboxId)) {
        const filePath = path.resolve(__dirname, "../public/static/edit.html");
        fs.readFile(filePath, "utf8", (error, html) =>{
          if (error) {
            console.error(error);
            return res.status(500).send("Internal Server Error");
          }
          const renderHTML = html.replace("{{SANDBOX_ID}}", sandboxId);
          return res.send(renderHTML);
      });
    }
    else{
      const originalSandbox = await getSandboxesById(sandboxId);
      if (!originalSandbox) {
        return res.status(404).send("Original sandbox not found.");
      }
      let copiedName = originalSandbox.sandbox_name + " Copy";
      if (copiedName.length > 20) copiedName = "Copied Sandbox";
      const { sandboxId: newSandboxId } = await createSandboxForUser(userId, copiedName);
  
      for (const planet of originalSandbox.planets) {
        try {
          await createPlanetInSandbox(newSandboxId, planet, planet.name);
        } catch (e) {
          console.error(`Failed to copy planet ${planet.name}:`, e);
        }
      }
      req.session.user.sandboxes.push(newSandboxId);

      return res.redirect(`/edit/${newSandboxId}`);
    }
  } catch (e) {
      console.error("Error in get route /edit/:SandboxId:", e);
      return res.status(500).send("Server error");
    }
  })  
  .post(async (req, res) => {
    const sandboxId = req.params.SandboxId;
    try {
      // const {
      //   sandboxName,
      //   planetName,
      //   x,
      //   y,
      //   radius,
      //   mass,
      //   velocity,
      //   isStatic,
      //   color,
      // } = req.body;

      // const planet = {
      //   sandboxName,
      //   planetName,
      //   x,
      //   y,
      //   radius,
      //   mass,
      //   velocity,
      //   isStatic,
      //   color,
      // };
      const { sandboxName, planetsData } = req.body;
      // TODO: Error check req.body
      await updateSandboxName(sandboxId, sandboxName);
      await updateAllPlanetsInSandbox(sandboxId, planetsData);
      res.json({ message: "Planets saved successfully" });
    } catch (e) {
      console.error("Planets saved unsucessfully:", e);
      res.status(400).json({ error: e.toString() });
    }
  });

router.route("/logout").get(async (req, res) => {
  req.session.user = null;
  res.redirect("/");
});

router.route("/view/:SandboxId").get(async (req, res) => {
  // TO DO: SAND BOXES MUST BE LOADED FIRST
  const sandboxId = req.params.SandboxId;
  if (req.session.user && req.session.user.signedIn === true) {
    const filePath = path.resolve(__dirname, "../public/static/viewSimSignedIn.html");  
    fs.readFile(filePath, "utf8", (error, html) => {
      if (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
      }
      const renderHTML = html.replace("{{SANDBOX_ID}}", sandboxId);
      res.send(renderHTML)});
  } else {
    const filePath = path.resolve(__dirname, "../public/static/viewSim.html");  
    fs.readFile(filePath, "utf8", (error, html) => {
      if (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
      }
      const renderHTML = html.replace("{{SANDBOX_ID}}", sandboxId);
      res.send(renderHTML)});
  }}
);

router.route("/delete/:SandboxId").delete(checkSignIn, async (req, res) => {
  const sandboxId = req.params.SandboxId;
  const userId = req.session.user.userId;
  //console.log(`deleting sandbox with id ${sandboxId} for user ${userId}`);
  try{
    await removeSandbox(userId, sandboxId);
    res.status(200).json({message: "Sandbox deleted"});
  }
  catch(e){
    console.log("error deletting sandbox", e);
    res.status(500).json({error: e.toString()});
  }
});

router.route("/api/sandbox/:SandboxId").get(async (req, res) => {
  try {
    const sandboxId = req.params.SandboxId;
    const sandbox = await getSandboxesById(sandboxId);
    res.json(sandbox);
  } catch (e) {
    console.error("Failed to load sandbox:", e);
    res.status(500).json({ error: e.toString() });
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

async function getSandboxNames(protocol, host, user) {
  //i changed this to an async function
  let ret = [];
  let sandboxesLi = await getSandboxesbyUserId(user); //this should be await as well i think
  for (let i = 0; i < sandboxesLi.length; i++) {
    //  let shorter = full.replace("/viewSandboxes", ""); 
    ret.push({
      name: sandboxesLi[i].sandbox_name,
      edit: `/edit/${sandboxesLi[i]._id}`,
      view: `/view/${sandboxesLi[i]._id}`,
      // Change localhost:3000?
      share: `${protocol}://${host}/view/${sandboxesLi[i]._id}`,
    });
  } //i also changed this to push instead of append it was giving me an error for append?
  return ret;
}

export default router;
