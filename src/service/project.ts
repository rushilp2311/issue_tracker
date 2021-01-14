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
  status_id: Joi.number().required(),
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
        'INSERT INTO project(project_name, status_id) VALUES ($1, $2 ) RETURNING project_id',
        [project.project_name, project.status_id],
      );
      return rows;
    } catch (error) {
      console.log(error);
    }
  });
}

export { validateProject, createProject };
