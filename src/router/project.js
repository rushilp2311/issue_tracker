const express = require('express');
const _ = require('lodash');
const { assignUserRole, updateMemberAccess } = require('../service/user');
const {
  validateProject,
  createProject,
  getAllProjectDetails,
  getAssignedProject,
  updateProjectDetails,
} = require('../service/project');
const { addProjectToCompany } = require('../service/company');
const { adminAuth } = require('../middleware/auth');
const router = express.Router();

router.post('/', adminAuth, async (req, res) => {
  const { error } = validateProject(
    _.pick(req.body, ['project_name', 'status_id']),
  );
  if (error) return res.status(400).send(error.details[0].message);

  let project = await createProject(req.body);
  if (project.length !== 0) {
    if (req.body.project_admin) {
      await assignUserRole({
        member_id: req.body.project_admin,
        project_id: project[0].project_id,
        role_id: 4,
      });
      const result = await addProjectToCompany({
        company_id: req.body.company_id,
        project_id: project[0].project_id,
      });
      if (result.length > 1) {
        res
          .status(400)
          .send(
            `Error while adding it to the company with id ${req.body.company_id}`,
          );
      }
    }
    return res.status(200).send('Project added.');
  } else {
    return res.status(400).send('Error Occured while creating Project.');
  }
});

router.get('/', adminAuth, async (req, res) => {
  try {
    const projects = await getAllProjectDetails(req.headers.company_id);
    res.status(200).send(projects);
  } catch (error) {
    console.error(error);
  }
});

router.get('/getassignedproject', async (req, res) => {
  try {
    const projects = await getAssignedProject(req.headers.member_id);
    res.status(200).send(projects);
  } catch (error) {
    console.error(error);
  }
});

router.post('/updateproject', async (req, res) => {
  try {
    const {
      project_id,
      project_name,
      due_date,
      status_id,
      member_id,
      prevMember,
    } = req.body.data;
    console.log(req.body.members);
    await updateProjectDetails(project_id, project_name, due_date, status_id);
    await updateMemberAccess(member_id, prevMember, project_id);
    let result;
    if (req.body.members.length > 0) {
      for (let i in req.body.members) {
        result = await assignUserRole({
          member_id: req.body.members[i].value.member_id,
          project_id: project_id,
          role_id: 2,
        });
      }
    }
    res.status(200).send('Project Details Updated');
  } catch (error) {
    console.log(error);
    res.status(500).send('Error occured while updating project data');
  }
});

module.exports = router;
