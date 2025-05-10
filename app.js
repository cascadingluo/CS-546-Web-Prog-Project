// includes middlewear for auth 

import express from 'express';
const app = express();
import session from 'express-session';
import configRoutes from './routes/index.js';

import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// https://expressjs.com/en/starter/static-files.html
app.use(express.static(path.join(__dirname, 'public')))
app.use('/static', (req, res, next) => {  
  res.sendStatus(404);
});

app.use(express.static('public'));

app.use(session({
  secret: 'simran wuz here',
  resave: false,
  saveUninitialized: false
}));

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
