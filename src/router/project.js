const express = require('express');
const _ = require('lodash');
const { assignUserRole } = require('../service/user');
const { validateProject, createProject } = require('../service/project');
const { adminAuth } = require('../middleware/auth');
const router = express.Router();

router.post('/', adminAuth, async (req, res) => {
  const { error } = validateProject(
    _.pick(req.body, ['project_name', 'status_id']),
  );
  if (error) return res.status(400).send(error.details[0].message);

  let project = await createProject(req.body);
  if (project.length !== 0) {
    await assignUserRole({
      member_id: req.body.member_id,
      project_id: project[0].project_id,
      role_id: req.body.role_id,
    });
    return res.status(200).send('Project added.');
  } else {
    return res.status(400).send('Error Occured while creating Project.');
  }
});

module.exports = router;
