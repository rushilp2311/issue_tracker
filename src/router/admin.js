const express = require('express');
const bcrypt = require('bcrypt');
const {
  validateMember,
  registerMember,
  generateAuthToken,
  getMemberByEmail,
  deleteUserByEmail,
} = require('../service/user');
const { getCompanyById, addCompany } = require('../service/company');
const { adminAuth } = require('../middleware/auth');
const router = express.Router();

router.post('/', async (req, res) => {
  const { error } = validateMember({
    name: req.body.name,
    email: req.body.email,
    company_id: req.body.company_id,
    is_admin: req.body.is_admin,
    password: req.body.password,
  });
  if (error) return res.status(400).send(error.details[0].message);

  let user = await getMemberByEmail(req.body.email);
  let company = await getCompanyById(req.body.company_id);
  if (user.length > 0 || company.length > 0)
    return res
      .status(400)
      .send(
        'Only one Admin allowed. Your Company already have an Admin account.',
      );

  user = req.body;
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await addCompany({
    company_id: user.company_id,
    company_name: user.company_name,
  });
  await registerMember({
    name: user.name,
    email: user.email,
    company_id: user.company_id,
    is_admin: user.is_admin,
    password: user.password,
  });
  const token = generateAuthToken(user);
  res
    .header('x-auth-token', token)
    .header('access-control-expose-headers', 'x-auth-token')
    .status(200)
    .send('Admin Added Successfully');
});

router.delete('/deletemember', adminAuth, async (req, res) => {
  let user = await getMemberByEmail(req.body.email);

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
