const express = require('express');
const { getMemberByEmail } = require('../service/user');
const {
  addIssue,
  addIssueToProject,
  getAllIssuesByProject,
  assignMemberToIssue,
} = require('../service/issues');

const router = express.Router();

router.post('/addissue', async (req, res) => {
  //assign member
  let member;
  if (req.body.assignee) {
    member = await getMemberByEmail(req.body.assignee);
  }
  const result = await addIssue(req.body);
  if (result.length > 0) {
    await addIssueToProject({
      issue_id: result[0].issue_id,
      project_id: req.body.project_id,
    });
    await assignMemberToIssue(member[0].member_id, result[0].issue_id);
  }
  res.send(result[0]);
});

router.get('/getallissues', async (req, res) => {
  const result = await getAllIssuesByProject(req.headers.project_id);
  res.status(200).send(result);
});

module.exports = router;
