import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';

// Кастомний валідатор для MongoDB ObjectId
const objectIdValidator = (value, helpers) => {
  if (!isValidObjectId(value)) {
    return helpers.error('any.invalid', { message: 'Invalid ID format' });
  }
  return value;
};

// Схема для створення бронювання (POST /api/bookings)
export const createBookingSchema = {
  [Segments.BODY]: Joi.object({
    toolId: Joi.string().required().custom(objectIdValidator),

    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),

    // Проста перевірка телефону
    phone: Joi.string().min(10).max(20).required(),

    // Дата початку: формат YYYY-MM-DD, не раніше "сьогодні" (now)
    startDate: Joi.date().iso().min('now').required().messages({
      'date.min': 'Start date cannot be in the past',
    }),

    // Дата закінчення: формат YYYY-MM-DD, не раніше дати початку
    endDate: Joi.date().iso().min(Joi.ref('startDate')).required().messages({
      'date.min': 'End date cannot be before start date',
    }),

    deliveryCity: Joi.string().min(2).max(100).required(),
    deliveryBranch: Joi.string().min(1).max(200).required(),
  }),
};
