const express = require('express');
const bcrypt = require('bcrypt');
const {
  validateMember,
  registerMember,
  getMemberByEmail,
  changeMemberPassword,
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

router.post('/registerMember', adminAuth, async (req, res) => {
  //check for admin
  const { error } = validateMember(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let member = await getMemberByEmail(req.body.email);

  if (member.length > 0)
    return res.status(400).send('Member already registered in your team.');

  member = req.body;
  const salt = await bcrypt.genSalt(10);
  member.password = await bcrypt.hash(member.password, salt);
  await registerMember(member);
  res
    .status(200)
    .send(
      'Member Added Successfully. And Email sent to member with credentials',
    );
});

/**
 * TODO: Password Reset function checks for the user. Resets the password for the member.
 */

router.put('/resetpassword', async (req, res) => {
  let member = await getMemberByEmail(req.body.email);
  if (member.length < 1)
    return res
      .status(400)
      .send('Member not found. Ask your company admin to get you registered.');
  member = req.body;
  const salt = await bcrypt.genSalt(10);
  member.password = await bcrypt.hash(member.password, salt);
  const result = await changeMemberPassword(member.email, member.password);
  if (result.length < 1) res.status(200).send('Password Updated Successfully.');
});

/**
 * TODO: Function to Get User Info
 */

module.exports = router;
