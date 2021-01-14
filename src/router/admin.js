const express = require('express');
const bcrypt = require('bcrypt');
const {
  validateUser,
  registerUser,
  generateAuthToken,
  getUserByEmail,
  deleteUserByEmail,
} = require('../service/user');
const { adminAuth } = require('../middleware/auth');
const router = express.Router();

router.post('/', async (req, res) => {
  const { error } = validateUser(req.body);
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

router.delete('/deletemember', adminAuth, async (req, res) => {
  let user = await getUserByEmail(req.body.email);

  if (user.length > 1) {
    await deleteUserByEmail(req.body.email);
    res
      .status(200)
      .send('Member Deleted Successfully. Email sended to the member');
  } else
    res
      .status(400)
      .send(
        "Some error cccured while deleting the user.Check if the user's email it correct.",
      );
  //Send email;
});

module.exports = router;
