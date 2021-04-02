import express from 'express';
import db from './database/db';
import member from './router/member';
import utils from './router/utils';
import auth from './router/auth';
import admin from './router/admin';
import project from './router/project';
import company from './router/company';
import issues from './router/issues';
import cors from 'cors';
async () => await db();
const app = express();
app.use(express.json());
app.use(cors());
//router use
app.use('/api/member', member);
app.use('/api/utils', utils);
app.use('/api/auth', auth);
app.use('/api/admin', admin);
app.use('/api/project', project);
app.use('/api/company', company);
app.use('/api/issues', issues);

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}...`);
});

module.exports = server;
