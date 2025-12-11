import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';
// import Category from '../models/category.js';


const objectIdValidator = (value, helpers) => {
  if (!isValidObjectId(value)) {
    return helpers.error('any.invalid', { message: 'Invalid ID format' });
  }
  return value;
};

export const getAllToolsSchema = {
    [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(4).max(16).default(16),
    search: Joi.string().trim().allow(''),
    })
};

export const toolIdSchema = {
    [Segments.PARAMS]: Joi.object({
    toolId: Joi.string().custom(objectIdValidator).required(),
    })
};