import { Feedbacks } from '../models/tool.js';

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