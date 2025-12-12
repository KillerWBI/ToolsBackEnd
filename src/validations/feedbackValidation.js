import { Joi, Segments } from 'celebrate';

// Схема для GET /feedbacks (валідація query-параметрів)
export const getFeedbacksSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20).default(10),
  }),
};