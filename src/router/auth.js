// const bcrypt = require('bcrypt');
const express = require('express');
import { validateLogin } from '../service/user';

const router = express.Router();

router.post('/', async (req, res) => {
  const { error } = validateLogin(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Fetch data from data base about the user.
});
