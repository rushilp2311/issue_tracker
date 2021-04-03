const express = require('express');
const { getMemberByEmail } = require('../service/user');
const {
  addIssue,
  addIssueToProject,
  getAllIssuesByProject,
} = require('../service/issues');

const router = express.Router();

router.post('/addissue', async (req, res) => {
  if (req.body.assignee) {
    console.log('Assignee');
    const user = await getMemberByEmail(req.body.assignee);
  }
  const result = await addIssue(req.body);
  if (result.length > 0) {
    await addIssueToProject({
      issue_id: result[0].issue_id,
      project_id: req.body.project_id,
    });
  }
  console.log(result);
});

router.get('/allissues', async (req, res) => {
  const result = await getAllIssuesByProject(req.headers.project_id);
});

module.exports = router;
