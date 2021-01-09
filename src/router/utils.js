const express = require('express');
const router = express.Router();
const utils = require('../database/utils');

router.get('/status', async (req, res) => {
  try {
    const statusList = await utils.getAllStatus();
    res.send(statusList);
  } catch (error) {
    console.error(error);
  }
});

router.get('/role', async (req, res) => {
  try {
    const rolesList = await utils.getAllRoles();
    res.send(rolesList);
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
