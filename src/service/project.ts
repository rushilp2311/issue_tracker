import db from '../database/db';
import Joi from 'joi';

interface Project {
  project_name: string;
  status_id: number;
  creation_date: string;
  due_date: string;
}

const projectSchema = Joi.object({
  project_name: Joi.string().min(1).max(255).required(),
  status_id: Joi.number(),
  creation_date: Joi.string(),
  due_date: Joi.string(),
});

function validateProject(project: Project): Joi.ValidationResult {
  return projectSchema.validate(project);
}

async function createProject(project: Project): Promise<Project[]> {
  return await db.then(async pool => {
    try {
      const {
        rows,
      } = await pool.query(
        'INSERT INTO project(project_name, due_date) VALUES ($1, $2) RETURNING project_id',
        [project.project_name, project.due_date],
      );
      return rows;
    } catch (error) {
      console.log(error);
    }
  });
}

async function getAllProjectDetails(company_id: string): Promise<void> {
  return await db.then(async pool => {
    try {
      const {
        rows,
      } = await pool.query(
        'SELECT  project_id ,project_name,creation_date,  due_date,name, role_title, status_id, pj.member_id FROM ROLE INNER JOIN( SELECT name, role_id, project_id, status_id, project_name, creation_date, due_date, p.member_id from MEMBER INNER JOIN ( SELECT member_id, role_id, P.project_id, status_id, project_name, creation_date, due_date FROM member_access INNER JOIN (SELECT project.project_id, project_name, status_id, creation_date, due_date FROM PROJECT LEFt JOIN company_projects on PROJECT.project_id = company_projects.project_id where company_projects.company_id = $1) as P on MEMBER_ACCESS.project_id = P.project_id) as p on MEMBER.member_id = p.member_id) as pj ON pj.role_id = ROLE.role_id where pj.role_id = 4;',
        [company_id],
      );
      return rows;
    } catch (error) {
      console.log(error);
    }
  });
}

async function getAssignedProject(member_id: string): Promise<void> {
  return await db.then(async pool => {
    try {
      const {
        rows,
      } = await pool.query(
        'SELECT project_id, role_id FROM MEMBER_ACCESS where member_id = $1',
        [member_id],
      );
      return rows;
    } catch (error) {
      console.log(error);
    }
  });
}

async function updateProjectDetails(
  project_id: number,
  project_name: string,
  due_date: string,
  status_id: number,
): Promise<void> {
  await db.then(async pool => {
    try {
      await pool.query(
        'UPDATE project SET project_name = $1, status_id = $2, due_date = $3 where project_id = $4;',
        [project_name, status_id, due_date, project_id],
      );
    } catch (error) {
      console.log(error);
    }
  });
}

export {
  validateProject,
  createProject,
  getAllProjectDetails,
  getAssignedProject,
  updateProjectDetails,
};
