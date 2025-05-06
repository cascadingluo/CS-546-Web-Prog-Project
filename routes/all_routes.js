import { Db } from "mongodb";
import { sandboxes } from "../config/mongoCollections";
import { register } from "../data/users";

// if not signed in the render home page
router.route('/').get(async (req, res) => {
    res.render('index');
  });

  // if signed in path has user id and send sto signed n Html page
router.route('/:userId').get(async (req, res) => {
    res.render('indexSignedIn');
  });

  // when submit shoudl be redirected to signed in index if correct
router.route('/login')
  .get(async (req, res) => {
    res.render('login');
  })
  .post(async (req, res) => {
    try{
      //code here for POST
      const userId = req.body.login_username;
      const password = req.body.login_password;
      const loggedin = await login(userId, password);
      if (!loggedin) {
        throw new Error("ADD ERR");
      }
      req.session.user ={
        signedIn : true,
        // id: get from Db
        userId:loggedin._id,
        userName:loggedin.userName,
        sandboxes:loggedin.sandboxes
      }
      //finish for render 
      // res.redirect('/private');
      if(req.session.user.signedIn === true){
        res.redirect(`/${loggedin._id}`);
    }
  }
  catch(e){
    // res.status(404).json({error: e});
    console.error(e); 
  }
});

 // when submit shoudl be redirected to signed in index if correct created 
router.route('/signup')
.get(async (req, res) => {
    res.render('signup');
  })
  .post(async (req, res) => {
    try{
      //code here for POST
      const userId = req.body.create_username;
      const password = req.body.create_password;
      const p2 = req.body.rep_pass;
      const age = req.body.age;
      const email = req.body.email;
      const registered = await register(userId, password, p2, age, email);
      if (!registered) {
        throw new Error("ADD ERR");
      }
      req.session.user ={
        signedIn : true,
        // id: get from Db
        userId:registered._id,
        userName:registered.userName,
        sandboxes:registered.sandboxes
      }

      if(req.session.user.signedIn === true){
        res.redirect(`/${loggedin._id}`);
    }
  }
  catch(e){
    // res.status(404).json({error: e});
    console.error(e); 
  }
});

function checkSignIn(req, res, next){
    if(req.session.user.signedIn === true){
       next();     
    } else {
       var err = new Error("Not logged in!");
       console.log(req.session.user);
       next(err);  
    }
 }
// if theuser is signed in the id upath the home page will give them the view prev sandboxes option 
  router.route('/:id',checkSignIn).get(async (req, res) => {
    res.render('indexSignedIn');
  });

 //can onyl view gallery if signed in
 router.route('/:UserId/sandboxGallery',checkSignIn).get(async (req, res) => {
    res.render('viewSandboxes');
  });

//   this version should have save
// FIGUREING OUT 
router.route('/:UserId/:SandboxId',checkSignIn)
  .get(async (req, res) => {
    res.render('edit');
  })
  // createSandboxForUser
  .post(async (req, res) => {
    try{
      //code here for POST
      const userId = req.body.userId;
      const password = req.body.password;
      const loggedin = await createSandboxForUser(userId, name);
      if (!loggedin) {
        throw new Error("ADD ERR");
      }
    }
      catch(e){
        console.error(e);
      }
    });


// no save button 
router.route('/edit').get(async (req, res) => {
    res.render('editNoSave');
  });


// have to send list of sandboxes
router.route('/:UserId/viewSandboxes/',checkSignIn).get(async (req, res) => {
    res.render('viewSandboxes');
  });

router.route('/:UserId/:SandboxId/view',checkSignIn).get(async (req, res) => {
    res.render('viewSimSIgnedIn');
  });

router.route('/:SandboxId/view',checkSignIn).get(async (req, res) => {
    res.render('viewSim');
  });

// shared STILL THINKING BOUT HOW TO DO THIS 
  router.route('/Shared/:sandboxId',checkSignIn).get(async (req, res) => {
    res.render('viewingShared');
  });