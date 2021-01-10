import db from '../database/db';
import jwt from 'jsonwebtoken';
import Joi from 'joi';

interface User {
  name: string;
  email: string;
  company_id: number;
  joining_date: string;
  last_login: string;
  is_admin: boolean;
  password: string;
}

const loginSchema = Joi.object({
  email: Joi.string().email().min(6).max(255).required(),
  password: Joi.string().min(6).max(255).required(),
});

const registerSchema = Joi.object({
  name: Joi.string().min(1).max(50).required(),
  email: Joi.string().email().min(6).max(255).required(),
  company_id: Joi.number().required(),
  joining_date: Joi.string(),
  last_login: Joi.string(),
  is_admin: Joi.boolean(),
  password: Joi.string().min(6).max(255).required(),
});

function generateAuthToken(user: User): string {
  const token = jwt.sign({
    name: user.name,
    email: user.email,
    company_id: user.company_id,
    is_admin: user.is_admin,
  });
  return token;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function validateLogin(user: any): Joi.ValidationResult {
  return loginSchema.validate(user);
}
function validateRegister(user: User): Joi.ValidationResult {
  return registerSchema.validate(user);
}

async function registerUser(user: User): Promise<any> {
  return await db.then(async pool => {
    try {
      await pool.query(
        'INSERT INTO member(name, email, company_id, is_admin, password) VALUES ($1, $2, $3, $4, $5)',
        [user.name, user.email, user.company_id, user.is_admin, user.password],
      );
    } catch (error) {
      console.log(error);
    }
  });
}

async function getUserByEmail(email: string): Promise<any> {
  return await db.then(async pool => {
    try {
      const {
        rows,
      } = await pool.query('SELECT name FROM member WHERE email = $1', [email]);
      return rows;
    } catch (error) {
      console.log(error);
    }
  });
}

export {
  generateAuthToken,
  getUserByEmail,
  validateLogin,
  validateRegister,
  registerUser,
};
