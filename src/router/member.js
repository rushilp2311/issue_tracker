const express = require('express');
const bcrypt = require('bcrypt');
const {
  validateMember,
  registerMember,
  getMemberByEmail,
  changeMemberPassword,
  getAllMembers,
} = require('../service/user');
const { assignUserRole } = require('../service/user');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();
router.get('/allmembers', adminAuth, async (req, res) => {
  try {
    const members = await getAllMembers(req.headers.company_id);
    res.status(200).send(members);
  } catch (error) {
    console.error(error);
  }
});

router.post('/registermember', adminAuth, async (req, res) => {
  const { error } = validateMember(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  console.log(req.user);
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

router.post('/assignrole', adminAuth, async (req, res) => {
  let role = await assignUserRole({
    member_id: req.body.member_id,
    project_id: req.body.project_id,
    role_id: req.body.role_id,
  });
  if (role.length < 1) res.status(200).send('Role assigned to Member.');
});

module.exports = router;
