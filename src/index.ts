import express from 'express';

const app: express.Application = express();

const PORT = process.env.PORT || 3001;

app.get('/', (req, res) => res.send('hello'));

const server = app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}...`);
});

module.exports = server;
