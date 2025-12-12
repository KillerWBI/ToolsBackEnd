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

export const toolIdSchema = {
  [Segments.PARAMS]: Joi.object({
    toolId: Joi.string().custom(objectIdValidator).required(),
  }),
};

export const updateToolSchema = {
  [Segments.PARAMS]: Joi.object({
    toolId: Joi.string().custom(objectIdValidator).required(),
  }),
  [Segments.BODY]: Joi.object({
    category: Joi.string().custom(objectIdValidator),
    name: Joi.string().min(3).max(200),
    description: Joi.string().min(10),
    pricePerDay: Joi.number().min(1),
    images: Joi.string().uri(),
    rating: Joi.number().min(0).max(5),
    specifications: Joi.array().items(Joi.string()),
    rentalTerms: Joi.string(),
    bookedDates: Joi.array().items(Joi.date()),
    feedbacks: Joi.array().items(
      Joi.object({
        _id: Joi.string().custom(objectIdValidator),
      })
    ),
  }).min(1),
};

export const DeleteToolShema = {
  [Segments.PARAMS]: Joi.object({
    toolId: Joi.string().custom(objectIdValidator).required(),
  }),
};
