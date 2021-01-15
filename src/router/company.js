const express = require('express');
const {
  validateCompany,
  getCompanyById,
  addCompany,
} = require('../service/company');

const router = express.Router();

router.get('/', async (req, res) => {
  const result = await getCompanyById(req.body.id);
  if (result.length < 1) res.status(404).send('Company Not Found');
  res.status(200).send(result);
});

router.post('/', async (req, res) => {
  const { error } = validateCompany(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let company = await getCompanyById(req.body.company_id);
  if (company.length > 0) res.status(400).send('Company already exists');
  else {
    const result = await addCompany(req.body);
    if (result.length < 1) res.status(200).send('Company Added');
  }
});

module.exports = router;
