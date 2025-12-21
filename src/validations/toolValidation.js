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
  }),
};

export const toolIdSchema = {
  [Segments.PARAMS]: Joi.object({
    toolId: Joi.string().custom(objectIdValidator).required(),
  }),
};

// Schema for creating a tool (POST /Tool)
// Note: images are uploaded as files via multipart/form-data (req.files), not in body
export const createToolSchema = {
  [Segments.BODY]: Joi.object({
    owner: Joi.string().required().custom(objectIdValidator),
    category: Joi.string().required().custom(objectIdValidator),
    name: Joi.string().required(),
    description: Joi.string().required(),
    pricePerDay: Joi.number().positive().required(),
    imageUrl: Joi.string().uri().optional(), // Fallback if no files uploaded
    images: Joi.any().optional(), // Allow images field (processed by multer)
    specifications: Joi.alternatives()
      .try(
        Joi.object(),
        Joi.string() // Allow JSON string for multipart/form-data
      )
      .optional(),
    rentalTerms: Joi.string().optional(),
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
    specifications: Joi.object().pattern(Joi.string(), Joi.string()),
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
