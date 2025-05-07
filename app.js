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
  res.redirect('/');
});

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
