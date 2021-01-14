import express from 'express';
import db from './database/db';
import member from './router/member';
import utils from './router/utils';
import auth from './router/auth';
import admin from './router/admin';
import project from './router/project';
async () => await db();
const app = express();
app.use(express.json());
//router use
app.use('/api/member', member);
app.use('/api/utils', utils);
app.use('/api/auth', auth);
app.use('/api/admin', admin);
app.use('/api/project', project);

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}...`);
});

module.exports = server;
