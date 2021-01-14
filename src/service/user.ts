import db from '../database/db';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import config from 'config';

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
  const token = jwt.sign(
    {
      name: user.name,
      email: user.email,
      company_id: user.company_id,
      is_admin: user.is_admin,
    },
    config.get('jwtPrivateKey'),
  );
  return token;
}

function validateLogin(user: User): Joi.ValidationResult {
  return loginSchema.validate(user);
}
function validateUser(user: User): Joi.ValidationResult {
  return registerSchema.validate(user);
}

async function registerUser(user: User): Promise<User[]> {
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

async function getUserByEmail(email: string): Promise<User[]> {
  return await db.then(async pool => {
    try {
      const { rows } = await pool.query(
        'SELECT * FROM member WHERE email = $1',
        [email],
      );
      return rows;
    } catch (error) {
      console.log(error);
    }
  });
}

async function deleteUserByEmail(email: string): Promise<void> {
  await db.then(async pool => {
    try {
      await pool.query('DELETE FROM member WHERE email = $1', [email]);
    } catch (error) {
      console.log(error);
    }
  });
}

export {
  generateAuthToken,
  getUserByEmail,
  validateLogin,
  validateUser,
  registerUser,
  deleteUserByEmail,
};
