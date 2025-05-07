// includes middlewear for auth 

import express from 'express';
const app = express();
import cookieParser from 'cookie-parser';
import configRoutes from './routes/index.js';
app.use(cookieParser());

app.use(express.json());


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
