import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';

// Кастомний валідатор для MongoDB ObjectId
const objectIdValidator = (value, helpers) => {
  if (!isValidObjectId(value)) {
    return helpers.error('any.invalid', { message: 'Invalid ID format' });
  }
  return value;
};

// Схема для GET /feedbacks (валідація query-параметрів)
export const getFeedbacksSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20).default(10),
  }),
};

// Схема для створення відгуку (POST /api/feedbacks)
export const createFeedbackSchema = {
  [Segments.BODY]: Joi.object({
    toolId: Joi.string().required().custom(objectIdValidator),
    rate: Joi.number().integer().min(1).max(5).required(),
    description: Joi.string().min(2).max(2000).required(),
  }),
};
