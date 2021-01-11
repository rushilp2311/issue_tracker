import express from 'express';
import db from './database/db';
import users from './router/users';
import utils from './router/utils';
import auth from './router/auth';
async () => await db();
const app = express();
app.use(express.json());
//router use
app.use('/api/users', users);
app.use('/api/utils', utils);
app.use('/api/auth', auth);

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}...`);
});

module.exports = server;
