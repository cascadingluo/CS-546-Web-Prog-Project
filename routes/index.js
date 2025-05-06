import userRoutes from './all_routes.js';

const constructorMethod = (app) => {
  app.use('/', userRoutes);
  

  app.use('*', (req, res) => {
    res.sendStatus(404);
  });
};

export default constructorMethod;