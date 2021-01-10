import jwt from 'jsonwebtoken';
import Joi from 'joi';

interface User {
  name: string;
  email: string;
  company_id: number;
  joining_date: string;
  last_login: string;
  is_admin: boolean;
}

const loginSchema = Joi.object({
  email: Joi.string().email().min(6).max(255).required(),
  password: Joi.string().min(6).max(255).required(),
});

const registerSchema = Joi.object({
  name: Joi.string().min(1).max(50).required(),
  email: Joi.string().email().min(6).max(255).required(),
  password: Joi.string().min(6).max(255).required(),
  company_id: Joi.number().required(),
  joining_date: Joi.string().required(),
  last_login: Joi.string(),
  is_admin: Joi.boolean(),
});

export function generateAuthToken(user: User): string {
  const token = jwt.sign({
    name: user.name,
    email: user.email,
    company_id: user.company_id,
    joining_date: user.joining_date,
    last_login: user.last_login,
    is_admin: user.is_admin,
  });
  return token;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function validateLogin(user: any): Joi.ValidationResult {
  return loginSchema.validate(user);
}
export function validateRegister(user: any): Joi.ValidationResult {
  return registerSchema.validate(user);
}
