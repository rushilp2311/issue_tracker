const express = require('express');
const router = express.Router();
const utils = require('../database/utils');

router.get('/getallutils', async (req, res) => {
  try {
    const statusList = await utils.getAllStatus();
    const rolesList = await utils.getAllRoles();
    const priorityList = await utils.getAllPriority();
    const typeList = await utils.getAllType();
    res.send({ statusList, rolesList, priorityList, typeList });
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
