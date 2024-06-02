import { Express } from 'express';
import routerStock from './stock/stock';
import routerRegister from './token/register';

const setRoutePaths = (app: Express) => {
  app.get('/', (req, res) => {
    res.status(200).send('Check... README.md file to be aware of API Contract');
  });

  app.use('/register', routerRegister);
  app.use('/stock', routerStock);
};
export default setRoutePaths;
