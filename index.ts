const express = require('express');
import {Request , Response , NextFunction} from 'express';

import router from './routes';
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.get('/health', (req:Request, res:Response) => {
  res.send("OK");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.use('/api' , router);









