import { Role } from '@prisma/client';
import Joi from 'joi';

const id = Joi.string().uuid();
const idParam = Joi.object({ id });
const idArray = Joi.array().items(id).min(0);
const uint = Joi.number().integer().min(0);
const bool = Joi.bool();
const role = Joi.string().valid(Role.USER, Role.ADMIN);

export const Valid = {
  id,
  idParam,
  idArray,
  uint,
  bool,
  role
};
