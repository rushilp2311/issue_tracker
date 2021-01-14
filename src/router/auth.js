const bcrypt = require('bcrypt');
const express = require('express');

const {
  generateAuthToken,
  getMemberByEmail,
  validateLogin,
} = require('../service/user');

const router = express.Router();

router.post('/', async (req, res) => {
  const { error } = validateLogin(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    const user = await getMemberByEmail(req.body.email);

    if (user.length < 1)
      return res.status(400).send('Invalid email or password');
    else {
      const validPassword = await bcrypt.compare(
        req.body.password,
        user[0].password,
      );
      if (!validPassword)
        return res.status(400).send('Invalid email or password');

      const token = generateAuthToken(user[0]);

      res.status(200).send(token);
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
