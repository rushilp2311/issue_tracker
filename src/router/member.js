const express = require('express');
const bcrypt = require('bcrypt');
const {
  registerMember,
  getMemberByEmail,
  changeMemberPassword,
  getAllMembers,
  updateMemberStatus,
  addMemberStatus,
  assignUserRole,
} = require('../service/user');
const { getAssignedProject } = require('../service/project');
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
  // const { error } = validateMember(req.body);
  // if (error) return res.status(400).send(error.details[0].message);
  let member = await getMemberByEmail(req.body.email);
  if (member.length > 0)
    return res.status(400).send('Member already registered in your team.');

  member = {
    name: req.body.name,
    email: req.body.email,
    company_id: req.body.company_id,
    is_admin: false,
    password: 'demopwd',
  };
  const salt = await bcrypt.genSalt(10);
  member.password = await bcrypt.hash(member.password, salt);
  const result = await registerMember(member);
  await addMemberStatus(result[0].member_id);
  res.status(200).send({
    member: result[0],
    message:
      'Member Added Successfully. And Email sent to member with credentials',
  });
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

router.delete('/deletemember', adminAuth, async (req, res) => {
  await updateMemberStatus(req.headers.data);
  res.send('Member Deleted');
});

router.get('/getassignedproject', async (req, res) => {
  const user = await getMemberByEmail(req.headers.email);
  const result = await getAssignedProject(user[0].member_id);
  res.status(200).send(result[0]);
});

module.exports = router;
