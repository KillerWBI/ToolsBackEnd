import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';


const objectIdValidator = (value, helpers) => {
  if (!isValidObjectId(value)) {
    return helpers.error('any.invalid', { message: 'Invalid ID format' });
  }
  return value;
};

export const getAllToolsSchema = {
    [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(20).default(16),
    search: Joi.string().trim().allow(''),
    category: Joi.string()
      .pattern(/^[a-f\d,]+$/i)
      .optional(),
    })
};

export const toolIdSchema = {
    [Segments.PARAMS]: Joi.object({
    toolId: Joi.string().custom(objectIdValidator).required(),
    })
};