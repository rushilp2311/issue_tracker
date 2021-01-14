const express = require('express');
const bcrypt = require('bcrypt');
const {
  validateUser,
  registerUser,
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

router.post('/registeruser', adminAuth, async (req, res) => {
  //check for admin
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await getUserByEmail(req.body.email);

  if (user.length > 0)
    return res.status(400).send('Member already registered in your team.');

  user = req.body;
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await registerUser(user);
  res
    .status(200)
    .send(
      'Member Added Successfully. And Email sent to member with credentials',
    );
});

/**
 * TODO: Password Reset function checks for the user. Resets the password for the member.
 */

/**
 * TODO: Function to Get User Info
 */

module.exports = router;
