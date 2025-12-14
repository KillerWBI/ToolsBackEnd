import { Feedbacks } from '../models/feedback.js';
import { Tool } from '../models/tool.js';
import createHttpError from 'http-errors';

// GET /feedbacks (список з пагінацією)
export const getLatestFeedbacks = async (req, res, next) => {
  try {
    // Беремо останні 10 відгуків
    const feedbacks = await Feedbacks.find()
      .sort({ createdAt: -1 }) // новіші зверху
      .limit(10);

    // Віддаємо масив на фронт
    res.status(200).json(feedbacks);
  } catch (error) {
    next(error);
  }
};

// POST /api/feedbacks
// Створення нового відгуку та перерахунок рейтингу інструменту
export const createFeedback = async (req, res, next) => {
  try {
    const { toolId, rate, description } = req.body;
    const { _id: userId, name } = req.user;

    // 1. Перевіряємо існування інструменту
    const tool = await Tool.findById(toolId);
    if (!tool) {
      return next(createHttpError(404, 'Tool not found'));
    }

    // 2. Створюємо відгук
    const feedback = await Feedbacks.create({
      toolId,
      owner: userId,
      name, // Зберігаємо ім'я автора для швидкодії
      rate,
      description,
    });

    // 3. Додаємо ID відгуку в масив інструменту
    await Tool.findByIdAndUpdate(toolId, {
      $push: { feedbacks: feedback._id },
    });

    // 4. Перераховуємо середній рейтинг інструменту
    // Знаходимо всі відгуки до цього інструменту
    const allFeedbacks = await Feedbacks.find({ toolId });

    const totalRate = allFeedbacks.reduce((acc, item) => acc + item.rate, 0);
    const newRating = (totalRate / allFeedbacks.length).toFixed(1); // Округляємо до 1 знаку

    // Оновлюємо рейтинг інструменту
    await Tool.findByIdAndUpdate(toolId, {
      rating: Number(newRating),
    });

    res.status(201).json(feedback);
  } catch (err) {
    next(err);
  }
};
