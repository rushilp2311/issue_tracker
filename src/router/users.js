const express = require('express');
const bcrypt = require('bcrypt');
const {
  validateRegister,
  registerUser,
  generateAuthToken,
  getUserByEmail,
} = require('../service/user');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();
router.get('/', (req, res) => {
  try {
    res.send('Hello User');
  } catch (error) {
    console.error(error);
  }
});

router.post('/admin', async (req, res) => {
  const { error } = validateRegister(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await getUserByEmail(req.body.email);

  if (user.length > 0)
    return res
      .status(400)
      .send(
        'Only one Admin allowed. Your Company already have an Admin account.',
      );

  user = req.body;
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await registerUser(user);
  const token = generateAuthToken(user);
  res
    .header('x-auth-token', token)
    .header('access-control-expose-headers', 'x-auth-token')
    .status(200)
    .send('Admin Added Successfully');
});

router.post('/registeruser', adminAuth, async (req, res) => {
  //check for admin
  const { error } = validateRegister(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await getUserByEmail(req.body.email);

  if (user.length > 0) return res.status(400).send('User already registered.');

  user = req.body;
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await registerUser(user);
  res
    .status(200)
    .send('User Added Successfully. And Email sent to user with credentials');
});

/**
 * TODO: Password Reset function checks for the user. Resets the password for the member.
 */

/**
 * TODO: Function to Get User Info
 */

module.exports = router;
