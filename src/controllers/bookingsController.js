import createHttpError from 'http-errors';
import { Booking } from '../models/booking.js';
import { Tool } from '../models/tool.js';

// POST /api/bookings
// Створення запиту на бронювання
export const createBooking = async (req, res, next) => {
  try {
    const {
      toolId,
      startDate,
      endDate,
      firstName,
      lastName,
      phone,
      deliveryCity,
      deliveryBranch,
    } = req.body;

    const { _id: userId } = req.user;

    // 1. Перевірка існування інструменту
    const tool = await Tool.findById(toolId);
    if (!tool) {
      return next(createHttpError(404, 'Tool not found'));
    }

    // 2. Перевірка доступності дат (Валідація перетину інтервалів)
    const newStart = new Date(startDate);
    const newEnd = new Date(endDate);

    const hasOverlap = tool.bookedDates.some((booking) => {
      const existingStart = new Date(booking.from);
      const existingEnd = new Date(booking.to);

      // Логіка перетину: (StartA <= EndB) і (EndA >= StartB)
      return newStart <= existingEnd && newEnd >= existingStart;
    });

    if (hasOverlap) {
      return next(
        createHttpError(
          409,
          'Tool is already booked for the selected dates. Please choose another date range.'
        )
      );
    }

    // 3. Розрахунок кількості днів та вартості
    const oneDay = 24 * 60 * 60 * 1000;
    // Округляємо різницю в днях
    let days = Math.round(Math.abs((newEnd - newStart) / oneDay));

    // Якщо бронювання на один день (дата початку = дата кінця), рахуємо як 1 день
    if (days === 0) days = 1;

    const totalPrice = days * tool.pricePerDay;

    // 4. Створення бронювання
    const booking = await Booking.create({
      toolId,
      userId,
      firstName,
      lastName,
      phone,
      startDate: newStart,
      endDate: newEnd,
      totalPrice,
      deliveryCity,
      deliveryBranch,
      status: 'pending', // Статус за замовчуванням
    });

    // 5. Оновлення інструменту (блокуємо дати)
    // Додаємо інтервал у bookedDates, щоб інші не могли його забронювати
    await Tool.findByIdAndUpdate(toolId, {
      $push: { bookedDates: { from: newStart, to: newEnd } },
    });

    res.status(201).json(booking);
  } catch (err) {
    next(err);
  }
};
