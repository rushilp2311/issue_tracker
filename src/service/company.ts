import db from '../database/db';
import Joi from 'joi';

interface Company {
  company_id: number;
  company_name: string;
}

const companySchema = Joi.object({
  company_id: Joi.number().required().min(1),
  company_name: Joi.string().required(),
});

function validateCompany(company: Company) {
  return companySchema.validate(company);
}

async function getCompanyById(id: number): Promise<Company[]> {
  return await db.then(async pool => {
    try {
      const {
        rows,
      } = await pool.query('SELECT * FROM company WHERE company_id = $1', [id]);
      return rows;
    } catch (error) {
      console.log(error);
    }
  });
}

async function addCompany(company: Company) {
  return await db.then(async pool => {
    try {
      const {
        rows,
      } = await pool.query(
        'INSERT INTO company(company_id, company_name) VALUES ($1, $2)',
        [company.company_id, company.company_name],
      );
      return rows;
    } catch (error) {
      console.log(error);
    }
  });
}

module.exports = {
  validateCompany,
  getCompanyById,
  addCompany,
};
