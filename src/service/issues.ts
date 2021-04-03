/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import db from '../database/db';

async function addIssue(issue): Promise<any> {
  return await db.then(async pool => {
    try {
      const {
        rows,
      } = await pool.query(
        'INSERT INTO issues(issue_title, description, status_id, type_id, priority, due_date) VALUES($1, $2, 1, $3, $4, $5) RETURNING issue_id, issue_title, description, assignee, status_id, type_id, priority, creation_date, due_date, sprint_id',
        [
          issue.issue_title,
          issue.issue_description,
          issue.type,
          issue.priority,
          issue.due_date,
        ],
      );
      return rows;
    } catch (error) {
      console.log(error);
    }
  });
}
async function addIssueToProject(issue): Promise<any> {
  await db.then(async pool => {
    try {
      await pool.query(
        'INSERT INTO project_issues(project_id, issue_id) VALUES($1, $2)',
        [issue.project_id, issue.issue_id],
      );
    } catch (error) {
      console.log(error);
    }
  });
}
async function getAllIssuesByProject(project_id): Promise<any> {
  return await db.then(async pool => {
    try {
      const {
        rows,
      } = await pool.query(
        'SELECT issues.issue_id, issue_title, description, assignee, status_id, type_id, priority, creation_date, due_date, sprint_id, PROJECT_ISSUES.project_id FROM issues LEFT JOIN project_issues ON issues.issue_id = project_issues.issue_id WHERE project_id = $1',
        [project_id],
      );
      return rows;
    } catch (error) {
      console.log(error);
    }
  });
}

export { addIssue, addIssueToProject, getAllIssuesByProject };
