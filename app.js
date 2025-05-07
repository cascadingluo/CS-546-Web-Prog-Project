// includes middlewear for auth 

import express from 'express';
const app = express();
import session from 'express-session';
import configRoutes from './routes/index.js';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


app.use(session({
  secret: 'simran wuz here',
  resave: false,
  saveUninitialized: false
}));

app.use('/static', (req, res, next) => {  
  //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/static
  //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/pop
  const file = req.path.split('/').pop();
  
  //auth user to access file ONTOP of the routes as well
  if (isLoggedInFile(file) && (!req.session || !req.session.user || !req.session.user.signedIn)) {
    return res.redirect('/static/index.html');
  }
  
  next();
});

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});


function isLoggedInFile(file) {
  const loggedInFiles = [
    'indexSignedIn.html',
    'viewSandboxes.html',
    'viewSimSIgnedIn.html',
    'edit.html',
    'viewingShared.html'
  ];
  return loggedInFiles.includes(file);
}