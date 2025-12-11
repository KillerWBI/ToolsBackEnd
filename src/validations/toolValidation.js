import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';

// Custom validator for MongoDB ObjectId
const objectIdValidator = (value, helpers) => {
  if (!isValidObjectId(value)) {
    return helpers.error('any.invalid', { message: 'Invalid ID format' });
  }
  return value;
};

// Schema for creating a tool (POST /Tool)
export const createToolSchema = {
  [Segments.BODY]: Joi.object({
    owner: Joi.string().required().custom(objectIdValidator),
    category: Joi.string().required().custom(objectIdValidator),
    name: Joi.string().required(),
    description: Joi.string().required(),
    pricePerDay: Joi.number().positive().required(),
    images: Joi.string().required(),
    specifications: Joi.object().optional(),
    rentalTerms: Joi.string().optional(),
  }),
};
